const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customiseSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  board_type: {
    type: String,
    required: true
  },
  board_shape: {
    type: String,
    required: true
  },
  board_size: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  thickness: {
    type: String,
    required: true
  },
  top_image: {
    type: String,
    required: true
  },
  bottom_image: {
    type: String,
    required: true
  },
  customise_price: {
    type: Number,
    required: true,
  },
}, { timestamps: true })

module.exports = mongoose.model('Customise', customiseSchema)