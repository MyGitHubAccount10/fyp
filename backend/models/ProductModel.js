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
    type: Number,
    required: true,
  },
  warehouse_quantity: {
    type: Number,
    required: true
  },  product_image: {
    type: String,
    required: true
  },
  product_image2: {
    type: String,
    required: false
  },
  product_image3: {
    type: String,
    required: false
  },
  threshold: {
    type: Number,
    default: 5,
    min: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)