import {jest} from '@jest/globals'


import rawData from './test-data/rawData.json'
import productData from './test-data/product.json'
import relatedData from './test-data/related.json'
import styleData from './test-data/style.json'
import db from './db.js'
import controller from './controller.js'
jest.mock('./db.js')
db.queryProduct = jest.fn()
db.queryFeatures = jest.fn()
db.queryRelated = jest.fn()
db.queryStyles = jest.fn()
db.queryPhotos = jest.fn()
db.querySkus = jest.fn()


it('should produce correct product data', async ()=>{
  db.queryProduct.mockResolvedValue(rawData.rawProduct)
  db.queryFeatures.mockResolvedValue(rawData.rawFeatures)
  let result = await controller.getProduct(1)
  expect(result).toEqual(productData)
})

it('should produce related product data as an array of IDs', async ()=>{
  db.queryRelated.mockResolvedValue(rawData.rawRelated)
  let result = await controller.getRelatedProducts(1)
  expect(result.length).toEqual(relatedData.length)
  for (const element of relatedData) {
    expect(result).toContain(element)
  }
})

it('should produce style data, including photos and skus', async ()=>{
  const {rawStyles, rawPhotos, rawSkus} = rawData
  db.queryStyles.mockResolvedValue(rawStyles)
  db.queryPhotos.mockImplementation(id => rawPhotos[id])
  db.querySkus.mockImplementation(id => rawSkus[id])
  let result = await controller.getStyles(1)
  expect(result).toEqual(styleData)
})
