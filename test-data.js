import controller from './controller.js'
import fs from 'node:fs/promises'
import db from './db.js'
import { fileURLToPath } from 'node:url'

await controller.getProduct(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/product.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})

await controller.getStyles(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/style.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})

await controller.getRelatedProducts(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/related.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})

let rawProducts = await db.queryAllProducts()
let rawProduct = await db.queryProduct(1)
let rawStyles = await db.queryStyles(1)
let rawRelated = await db.queryRelated(1)
let rawFeatures = await db.queryFeatures(1)
let rawPhotos = {}
let rawSkus = {}
for (const row of rawStyles.rows) {
  rawPhotos[row.style_id] = await db.queryPhotos(row.style_id)
  rawSkus[row.style_id] = await db.querySkus(row.style_id)
}

let rawData = {rawProducts, rawProduct, rawStyles, rawRelated, rawPhotos, rawSkus, rawFeatures}

await fs.writeFile(
  fileURLToPath(new URL('./test-data/rawData.json', import.meta.url)),
  JSON.stringify(rawData, null, 2)
)

db.close()