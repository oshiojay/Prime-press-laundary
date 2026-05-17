const clientModel = require('../model/client')
const cloudinary = require('../middleware/cloudinary')
const { emailTemplate} = require('../email')
const {brevo} = require('../utils/brevo')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const fs = require('fs')



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
            otp: otp
        })

        brevo(newClient.email, newClient.fullName, emailTemplate(newClient.fullName, newClient.otp))
        await newClient.save()
        res.status(201).json({
            message: "Client created successfully",
            data: newClient
        })
    } catch (error) {
        res.status(500).json({
            message: `"Something went wrong", ${error.message}`
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


exports.updateProfile = async (req, res) => {
    let filePath

    try {
        const file = req.file || req.files?.[0]

        if (!file) {
            return res.status(400).json({
                message: "Please upload a profile picture"
            })
        }

        filePath = file.path

        const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
        const extractSecureurl = {secureUrl:uploadToCloudinary.secure_url, publicId: uploadToCloudinary.public_id}

        const {id}= req.params
        
        const updateUser = await clientModel.findByIdAndUpdate(
            id,
            { profilePicture: extractSecureurl },
            { new: true }
        )

        if (!updateUser) {
            return res.status(404).json({
                message: "Client not found"
            })
        }
        
        res.status(200).json({
            message: "User profile updated successfully",
            data: updateUser
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}
