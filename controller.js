import db from './db.js'

const controller = {
  getProduct: async (productId)=>{
    const [body] = (await db.queryProduct(productId)).rows
    delete body.product_id
    body.id = productId
    body.features = (await db.queryFeatures(productId)).rows
    return body
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