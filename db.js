import cassandra from 'cassandra-driver'
import 'dotenv/config'
const {DB_URL} = process.env

let client = new cassandra.Client({
  contactPoints: [DB_URL],
  localDataCenter: 'datacenter1',
  keyspace: 'product_space'
})

const db = {

  queryAllProducts: async (page, count)=>{
    let query = `
      SELECT * from product_by_id
    `
    const options = { prepare: true , fetchSize: 200 }
    const results = await client.execute(query, null, options)

    const products = []
    const start = (page - 1) * count
    const stop = page * count
    let index = 0
    for await (const row of results) {
      if (++index > stop) return products
      if (index > start) products.push(row)
    }
    return products
  },

  queryProduct: (productId)=>{
    let query = `
      SELECT * from product_by_id
      WHERE product_id = ?
    `
    return client.execute(query, [productId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QP:', err.message)
      throw err
    })
  },

  queryStyles: (productId)=>{
    let query = `
      SELECT * from styles_by_product
      WHERE product_id = ?
    `
    return client.execute(query, [productId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QS:', err.message)
      throw err
    })
  },

  queryPhotos: (styleId)=>{
    let query = `
      SELECT * from photos_by_style
      WHERE style_id = ?
    `
    return client.execute(query, [styleId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QH:', err.message)
      throw err
    })
  },

  querySkus: (styleId)=>{
    let query = `
      SELECT * from skus_by_style
      WHERE style_id = ?
    `
    return client.execute(query, [styleId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QK:', err.message)
      throw err
    })
  },

  queryRelated: (productId)=>{
    let query = `
    SELECT * from related_by_product
    WHERE product_id = ?
    `
    return client.execute(query, [productId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QR:', err.message)
      throw err
    })
  },

  queryFeatures: (productId)=>{
    let query = `
    SELECT * from features_by_product
    WHERE product_id = ?
    `
    return client.execute(query, [productId], {prepare: true})
    .catch((err)=>{
      console.log('DB-QF:', err.message)
      throw err
    })
  },

  close: ()=>{
    if (client) client.shutdown()
    client = null
  },

  open: ()=>{
    db.close()
    client = new cassandra.Client({
      contactPoints: [DB_URL],
      localDataCenter: 'datacenter1',
      keyspace: 'product_space'
    })
  }
}

export default db