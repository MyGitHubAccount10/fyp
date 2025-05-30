const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true
  },
  shipping_address: {
    type: String,
    required: true
  },
  order_date: {
    type: Date,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)