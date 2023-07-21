import * as fs from 'node:fs/promises'
import LineByLine from 'n-readlines'
import { fileURLToPath } from 'node:url'
import cassandra from 'cassandra-driver'

const client = new cassandra.Client({
  // Assumes that the database is available at localhost:8080.
  // If repeating the process in a different env, this value
  // may need to be changed.
  contactPoints: ['localhost:8080'],
  localDataCenter: 'datacenter1',
  keyspace: 'product_space'
});

const tables = process.argv.length > 2 ?
  process.argv.slice(2)
  :
  ['features', 'photos', 'product', 'related', 'skus', 'styles']

const files = tables.map((table)=>{
  return new LineByLine(fileURLToPath(new URL(`./${table}.csv`, import.meta.url)))
})

const legend = {}
files.forEach((file, i)=>{
  legend[tables[i]] = file.next().toString().split(',')
})

// Writes legend to a json file in the data directory.
// This was done for convenience during development.
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
const BATCH_DURATION = 150
let batchCount = 0
let updateCount = 0

async function processFile(file) {
  batchCount++
  let start = Date.now()
  while ((Date.now() - start) < BATCH_DURATION) {
    let line = file.next()
    if (line) {
      await processRecord(line)
    } else {
      file = files[++index]
      if (file) {
        console.log('Migrating', tables[index])
      } else {
        done = true
        return
      }
    }
  }
  // console.log('rescheduling')
  setTimeout(processFile.bind(null, file))
}
let index = 0
console.log('Migrating', tables[index])
processFile(files[index])

async function processRecord(line) {
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
        // In the original dataset, the sku id column is an integer type.
        // In the new database, this is changed to a string to add support
        // for non-integer product skus.
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
    await client.execute(query, values, { prepare: true })
    .then(()=>{
      recordCount++
    })
    .catch((err)=>{
      console.log(err.message)
      console.log('skipping record')
      skipCount++
    })

    // In the original dataset, the default style for a product is
    // stored in the styles table as a boolean. In the new dataset,
    // it is stored in the products table as a style id, in order to
    // prevent potential conflicts
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
        await client.execute(query)
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

let updateTime = start
function checkIn() {
  if (!done) {
    let elapsed = Date.now() - updateTime
    console.log(new Date())
    console.log(`Still working... ${recordCount} records processed, current rate ${Math.floor(((recordCount - updateCount) / (elapsed / 1000)) + 0.5)} records per second`)
    updateCount = recordCount
    updateTime = Date.now()
    setTimeout(checkIn, 60000)
  }
}
setTimeout(checkIn, 5000)

async function finishUp() {
  if (done) {
    let elapsed = Date.now() - start
    console.log(`Finished migrating all files in ${Math.floor((elapsed / 60000) + 0.5)} minutes`)
    console.log(`${recordCount} records were added`)
    console.log(`${skipCount} records were skipped`)
  } else {
    setTimeout(finishUp, 500)
  }
}
finishUp()