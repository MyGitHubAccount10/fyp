const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customiseSchema = new Schema({
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
  base_top_color: {
    type: String,
    required: true
  },
  base_bottom_color: {
    type: String,
    required: true
  },
  customise_price: {
    type: Number,
    required: true
  },
  customise_status: {
    type: String,
    required: true
  },
  created_at: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Customise', customiseSchema)