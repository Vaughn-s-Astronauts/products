import db from './db.js'

const controller = {
  getProduct: async (productId)=>{
    const [product] = (await db.queryProduct(productId)).rows
    delete product.product_id
    product.id = productId
    product.features = (await db.queryFeatures(productId)).rows
    return product
  },

  getAllProducts: ()=>{
    // TODO
  },

  getStyles: async (productId)=>{
    const styles = (await db.queryStyles(productId)).rows
    for (const style of styles) {
      style.photos = (await db.queryPhotos(style.style_id)).rows
      const skus = (await db.querySkus(style.style_id)).rows
      style.skus = {}
      skus.forEach((sku)=>{
        const {quantity, size} = sku
        style.skus[sku.sku] = {quantity, size}
      })
      style.id = style.style_id
      delete style.style_id
    }
    return styles
  },

  getRelatedProducts: async (productId)=>{
    const tuples = (await db.queryRelated(productId)).rows
    return tuples.map((tuple)=>{
      return tuple.related_id
    })
  }
}

export default controller