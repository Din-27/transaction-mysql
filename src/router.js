const express = require('express')
const order = require('../src/order')
const router = express.Router()

router.post('/order', order.createOrder)

module.exports = router