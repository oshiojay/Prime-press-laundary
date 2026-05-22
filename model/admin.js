const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        trim: true
    },
    otpExpire:{
        type: Date,
         default: ()=>{
        return Date.now() + (1000*60*5)
}
    }
}, {timestamps: true})

const clientModel = mongoose.model('Client', clientSchema)

module.exports = clientModel;
