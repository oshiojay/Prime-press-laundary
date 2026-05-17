const clientModel = require('../model/client')
const cloudinary = require('../middleware/cloudinary')
const { emailTemplate} = require('../email')
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

exports.forgotPassword = async (req,res) =>{
    try {
        
        const {email} = req.body
        const user = await clientModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({
                message: "Client not found"
            })
        }
        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 10 * 60000);

        const emailData = {
            fullName: user.fullName,
            otp: OTP
        }
      
        await brevo(user.email, user.fullName, emailTemplate(emailData.fullName, emailData.otp))
         
        user.otp = OTP;
        user.otpExpire = expiresAt;

        await user.save();

        res.status(200).json({
            message: 'Please check your email for password OTP'
        })



    } catch (error) {
        res.status(500).json({
            message: `"Something went wrong", ${error.message}`
        })
    }
}



exports.resetPassword = async (req,res) => {
    try {
        const {email, otp, newPassword} = req.body
        const user = await clientModel.findOne({email: email.toLowerCase()})
    
        if(!user) {
            return res.status(404).json({
                message: "Client not found"
            })
        }
        if(user.otp !== otp || Date.now() > user.otpExpire) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedPassword
        
        await user.save()

        await brevo(user.email, user.fullName, resetPasswordTemplate(user.fullName))

        res.status(200).json({
            message: "Password reset successfully"
        })
    
    } catch (error) {
        res.status(500).json({
            message: `"Something went wrong", ${error.message}`
        })
    }
}