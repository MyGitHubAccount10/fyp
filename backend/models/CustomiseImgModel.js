const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customiseimgSchema = new Schema({
  customise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customise',
    required: true
  },
  customise_img: {
    type: String,
    required: true
  },
  x_position: {
    type: Number,
    required: true
  },
  y_position: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  rotation: {
    type: Number,
    required: true
  },
  layer_order: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Customise-Img', customiseimgSchema)