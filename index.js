import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import controller from './controller.js'

const app = express()

app.use(morgan('dev'))

app.use(bodyParser.json())

app.get('/products/:product_id/related', (req, res)=>{
  const {product_id} = req.params
  controller.getRelatedProducts(product_id)
  .then((data)=>{
    res.status(200)
    res.send(data)
  })
  .catch((err)=>{
    console.log(err.message)
    res.sendStatus(418)
  })
})

app.get('/products/:product_id/styles', (req, res)=>{
  const {product_id} = req.params
  controller.getStyles(product_id)
  .then((data)=>{
    res.status(200)
    res.send(data)
  })
  .catch((err)=>{
    console.log(err.message)
    res.sendStatus(418)
  })
})

app.get('/products/:product_id', (req, res)=>{
  const {product_id} = req.params
  controller.getProduct(product_id)
  .then((data)=>{
    res.status(200)
    res.send(data)
  })
  .catch((err)=>{
    console.log(err.message)
    res.sendStatus(418)
  })
})

app.get('/products', (req, res, next)=>{
  const page = req.query.page || 1
  const count = req.query.count || 5
  controller.getAllProducts(page, count)
  .then((data)=>{
    res.status(200)
    res.send(data)
  })
  .catch((err)=>{
    console.log(err.message)
    res.sendStatus(418)
  })
})

app.get('/', (req, res)=>{
  res.sendStatus(404)
})

app.listen(8000, ()=>{
  console.log('Listening on port 8000')
})