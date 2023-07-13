import controller from './controller.js'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

controller.getProduct(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/product.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})

controller.getStyles(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/style.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})

controller.getRelatedProducts(1)
.then((result)=>{
  fs.writeFile(
    fileURLToPath(new URL('./test-data/related.json', import.meta.url)),
    JSON.stringify(result, null, 2)
  )
})