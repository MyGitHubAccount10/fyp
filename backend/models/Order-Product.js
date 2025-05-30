const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderproductSchema = new Schema({
  order_quantity: {
    type: Number,
    required: true
  },
  order_unit_price: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order-Product', orderproductSchema)