import cassandra from 'cassandra-driver'

const client = new cassandra.Client({
  contactPoints: ['localhost:8080'],
  localDataCenter: 'datacenter1',
  keyspace: 'product_space'
});

const db = {

  queryAllProducts: ()=>{
    let query = `
      SELECT * from product_by_id
    `
    return client.execute(query)
    .catch((err)=>{
      console.log('DB-QA:', err.message)
      throw err
    })
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
  }
}

export default db