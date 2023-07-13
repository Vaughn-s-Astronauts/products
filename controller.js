import db from './db.js'

const controller = {
  getProduct: (productId)=>{
    return db.queryProduct(productId)
    .then(async (result)=>{
      let [body] = result.rows
      delete body.product_id
      body.id = productId
      body.features = await db.queryFeatures(productId).then(res => res.rows)
      return body
    })
    .catch((err)=>{

    })
  },

  getAllProducts: ()=>{
    return db.queryAllProducts()
    .catch((err)=>{

    })
  },

  getStyles: (productId)=>{
    return db.queryStyles(productId)
    .catch((err)=>{

    })
  },

  getRelatedProducts: (productId)=>{
    return db.queryRelated(productId)
    .catch((err)=>{

    })
  }
}

export default controller