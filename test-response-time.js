import axios from 'axios'
import 'dotenv/config'

const API_URL = `http://${process.env.API_HOST}:${process.env.API_PORT}`

const avgResponseTime = async (url, options, testCount)=>{
  try{
    let times = []
    for (let x = 0; x < testCount; x++) {
      let start = Date.now()
      await axios.get(url, options)
      times.push(Date.now() - start)
    }
    let total = times.reduce((acc, value) => acc + value, 0)
    return Math.floor(total / times.length)
  } catch (err) {
    console.log(err.message)
    return null
  }
}

let endpoint = `/products`
let trials = 1000
let result = null
let options = null

const runTest = async (productId) => {
  let start = Date.now()
  endpoint = `/products/${productId}`
  console.log(`Testing ${endpoint}`)
  result = await avgResponseTime(API_URL + endpoint, options, trials)
  console.log(`...Average ${result}ms over ${trials} trials\n`)

  endpoint = `/products/${productId}/styles`
  console.log(`Testing ${endpoint}`)
  result = await avgResponseTime(API_URL + endpoint, options, trials)
  console.log(`...Average ${result}ms over ${trials} trials\n`)

  endpoint = `/products/${productId}/related`
  console.log(`Testing ${endpoint}`)
  result = await avgResponseTime(API_URL + endpoint, options, trials)
  console.log(`...Average ${result}ms over ${trials} trials\n`)
  return Date.now() - start
}

var p = Math.floor(Math.random() * 200000)
console.log(`Choosing random catalogue page: ${p}`)
options = {params: {page: p, count: 5}}

console.log(`Testing ${endpoint}`)
options = null
result = await avgResponseTime(API_URL + endpoint, options, trials)
console.log(`...Average ${result}ms over ${trials} trials\n`)

var p = Math.floor(Math.random() * 1000000)
console.log(`Choosing random product id: ${p}`)
runTest(p)