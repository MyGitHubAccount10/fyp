const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderproductSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order_qty: {
    type: Number,
    required: true
  },
  order_unit_price: {
    type: Number,
    required: true,
  },
  order_size: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order-Product', orderproductSchema)