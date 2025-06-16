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
  },  shipping_address: {
    type: String,
    required: true
  },
  total_amount: {
    type: Number,
    required: true,
    set: v => Number(v).toFixed(2)
  },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)