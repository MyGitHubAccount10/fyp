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
  top_color: {
    type: String,
    required: true
  },
  bottom_color: {
    type: String,
    required: true
  },
  customise_price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    set: v => {
      return mongoose.Schema.Types.Decimal128.fromString(
        Number(v).toFixed(2)
      );
    }
  },
  customise_date: {
    type: Date,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Customise', customiseSchema)