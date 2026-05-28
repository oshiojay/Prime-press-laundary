const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    dateAndTime: {
        type: String,
        required: true
    }
}, {timestamps: true})
    


const bookingModel = mongoose.model('Booking', bookingSchema)

module.exports = bookingModel;