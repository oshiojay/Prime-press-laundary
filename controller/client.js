const clientModel = require('../model/client')
const cloudinary = require('../middleware/cloudinary')
const {emailTemplate} = require('../email')
const {brevo} = require('../utils/brevo')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')



exports.createClient = async (req, res) => {
    try {
        const {fullName, email, password} = req.body

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newClient = new clientModel({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            otp
        })

        brevo(newClient.email, newClient.fullName, emailTemplate(newClient.fullName, newClient.otp))
        await newClient.save()
        res.status(201).json({
            message: "Client created successfully",
            data: newClient
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}


exports.verifyClient = async (req, res) => {
    try {
        const {email, otp} = req.body
        const user = await clientModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({
                message: "Client not found"
            })
        }

        if(Date.now() > user.otpExpire ||user.otp !== otp) {
            return res.status(404).json({
                message: "Invalid OTP"
            })
        }
        user.isVerified = true
        await user.save()
        res.status(200).json({
            message: "OTP verified successfully",
            data: user
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}