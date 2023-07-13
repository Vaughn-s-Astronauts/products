import * as fs from 'node:fs/promises'
import LineByLine from 'n-readlines'
import { fileURLToPath } from 'node:url'
import cassandra from 'cassandra-driver'

const client = new cassandra.Client({
  contactPoints: ['localhost:8080'],
  localDataCenter: 'datacenter1',
  keyspace: 'product_space'
});

const tables = ['features', 'photos', 'product', 'related', 'skus', 'styles']

const files = tables.map((table)=>{
  return new LineByLine(fileURLToPath(new URL(`./${table}.csv`, import.meta.url)))
})

const legend = {}
files.forEach((file, i)=>{
  legend[tables[i]] = file.next().toString().split(',')
})
fs.writeFile(
  fileURLToPath(new URL('./legend.json', import.meta.url)),
  JSON.stringify(legend, null, 2)
)

let mappings = {
  features: ['features_by_product', {
    product_id: 'product_id',
    feature: 'feature',
    value: 'value'
  }],
  photos: ['photos_by_style', {
    styleId: 'style_id',
    url: 'url',
    thumbnail_url: 'thumbnail_url'
  }],
  product: ['product_by_id', {
    id: 'product_id',
    name: 'name',
    slogan: 'slogan',
    description: 'description',
    category: 'category',
    default_price: 'default_price'
  }],
  related: ['related_by_product', {
    current_product_id: 'product_id',
    related_product_id: 'related_id'
  }],
  skus: ['skus_by_style', {
    styleId: 'style_id',
    id: 'sku',
    size: 'size',
    quantity: 'quantity'
  }],
  styles: ['styles_by_product', {
    id: 'style_id',
    productId: 'product_id',
    name: 'name',
    sale_price: 'sale_price',
    original_price: 'original_price'
  }]
}

let recordCount = 0
let skipCount = 0
let done = false
let start = Date.now()

function processFile(file) {
  let line = file.next()
  if (line) {
    processRecord(line)
  } else {
    file = files[++index]
    if (file) {
      console.log('Migrating', tables[index])
    } else {
      done = true
      return
    }
  }
  setTimeout(processFile.bind(null, file))
}
let index = 0
console.log('Migrating', tables[index])
processFile(files[index])

function processRecord(line) {
  const title = tables[index]
  const [tableName, columnMap] = mappings[title]
  const oldColumns = legend[title]

  const columns = []
  oldColumns.forEach((col)=>{
    if (columnMap[col]) {
    columns.push(columnMap[col])
    }
  })

  try {
    const values = []
    let oldValues = []
    try {
      oldValues = JSON.parse(`[${line.toString()}]`)
    } catch (err) {
      console.log('bad data, could not parse:')
      console.log(line.toString())
    }
    oldColumns.forEach((col, j)=>{
      if (columnMap[col]) {
        // Transform sku to string
        if (columnMap[col] === 'sku') {
          oldValues[j] = JSON.stringify(oldValues[j])
        }
        values.push(oldValues[j])
      }
    })
    let query = (`
      INSERT INTO ${tableName} (${columns.join(',')})
      VALUES (${values.map(()=>'?').join(',')})
    `)
    client.execute(query, values, { prepare: true })
    .then(()=>{
      recordCount++
    })
    .catch((err)=>{
      console.log(err.message)
      console.log('skipping record')
      skipCount++
    })

    if (title === 'styles') {
      let style_id = oldValues[0]
      let product_id = oldValues[1]
      let isDefault = !!(oldValues[5])
      if (isDefault) {
        query = (`
          UPDATE product_by_id
          SET default_style_id = ${style_id}
          WHERE product_id = ${product_id}
        `)
        client.execute(query)
        .catch((err)=>{
          console.log('Could not update default style:')
          console.log(err.message)
        })
      }
    }
  } catch (err) {
    throw err
  }
}

function checkIn() {
  if (!done) {
    console.log(new Date())
    console.log(`Still working... ${recordCount} records processed`)
    setTimeout(checkIn, 60000)
  }
}
setTimeout(checkIn, 5000)

async function finishUp() {
  if (done) {
    let elapsed = Date.now() - start
    console.log(`Finished migrating all files in ${elapsed / 60000} minutes`)
    console.log(`${recordCount} records were added`)
    console.log(`${skipCount} records were skipped`)
  } else {
    setTimeout(finishUp, 500)
  }
}
finishUp()