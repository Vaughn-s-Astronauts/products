import express from 'express'
import body-parser from 'body-parser'
import morgan from 'morgan'
import controller from './controller'

const app = express()

app.use(morgan(dev))

app.use(body-parser.json())

app.get('/products/:id', (req, res)=>{

})

app.get('/products', (req, res)=>{

})

