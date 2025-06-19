const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    shipping_address: {
        type: String,
        required: true
    },
    // REMOVED: The postal_code field is no longer needed
    // postal_code: {
    //     type: String,
    //     required: true
    // },
    order_date: {
        type: Date,
        required: true
    },
    total_amount: {
        type: Number,
        required: true,
        set: v => Number(v).toFixed(2)
    }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)