const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  payment_method: {
    type: String,
    required: true
  },
  shipping_address: {
    type: String,
    required: true
  },
  order_date: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)