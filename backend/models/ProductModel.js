const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  product_price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    set: v => {
      return mongoose.Schema.Types.Decimal128.fromString(
        Number(v).toFixed(2)
      );
    }
  },
  warehouse_quantity: {
    type: Number,
    required: true
  },
  product_image: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)