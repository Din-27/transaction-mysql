const express = require('express')
const { urlencoded } = require('body-parser')
const router = require('./src/router')

const app = express()


const port = 5000

app.use(express.json())
app.use(router)
app.use(urlencoded({extended : true}))

app.listen(port, ()=> console.log(`Listening on Port ${port}`))