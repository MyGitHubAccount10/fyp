const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderproductSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order_quantity: {
    type: Number,
    required: true
  },
  order_unit_price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    set: v => {
      return mongoose.Schema.Types.Decimal128.fromString(
        Number(v).toFixed(2)
      );
    }
  }
}, { timestamps: true })

module.exports = mongoose.model('Order-Product', orderproductSchema)