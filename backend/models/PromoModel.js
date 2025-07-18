const mongoose = require('mongoose')

const Schema = mongoose.Schema

const promoSchema = new Schema({
  promo_title: {
    type: String,
    required: true
  },
  promo_image: {
    type: String,
    required: true
  },
  promo_link: {
    type: String,
    required: true,
    default: '/'
  },
  display_order: {
    type: Number,
    required: true,
    default: 0
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Promo', promoSchema)
