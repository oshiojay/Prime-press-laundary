const clientModel = require('../model/admin')
const { emailTemplate, resetPasswordTemplate, resetPasswordSuccessfulTemplate } = require('../email')
const {brevo} = require('../utils/brevo')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const isEmailDeliveryError = (error) => error.code === "EMAIL_DELIVERY_FAILED"




exports.createAdmin = async (req, res) => {
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
        console.log(email)
        await brevo(newClient.email, newClient.fullName, emailTemplate(newClient.fullName, newClient.otp))
        console.log(otp)
        await newClient.save()
        res.status(201).json({
            message: "Admin created successfully",
            data: newClient
        })
    } catch (error) {
        if (isEmailDeliveryError(error)) {
            return res.status(503).json({
                message: "Unable to send verification email. Please try again."
            })
        }

        res.status(500).json({
            message: `"Something went wrong", ${error.message}`
        })
    }
}


exports.verifyAdmin = async (req, res) => {
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

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const existingClient = await clientModel.findOne({ email: email.toLowerCase() });
        if (!existingClient) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otpExpire = new Date(Date.now() + 1000 * 60 * 5);

        if (Date.now() > existingClient.otpExpire || otp !== existingClient.otp){
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            })
        }

        console.log(otp)
        existingClient.otp = otp;
        existingClient.otpExpire = otpExpire;

        await existingClient.save();
        await brevo(existingClient.email, existingClient.fullName, emailTemplate(existingClient.fullName, existingClient.otp))

        res.status(200).json({
            message: 'OTP sent successfully. Please check your email.'
        });
    } catch (error) {
        if (isEmailDeliveryError(error)) {
            return res.status(503).json({
                message: "Unable to send OTP. Please try again."
            })
        }

        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

exports.loginClient = async (req, res) => {
    try {

        const {email, password} = req.body;
        const client = await clientModel.findOne({ email: email.toLowerCase() })
        if (!client){
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }
        
        if (client.isLocked) {
            return res.status(423).json({
                message: 'Account locked'
            })
        }

        const correctPassword = await bcrypt.compare(password, client.password)

        if (!correctPassword) {
            client.failedLoginAttempts = (client.failedLoginAttempts || 0) + 1
            if (client.failedLoginAttempts >= 5){
                client.isLocked = true
                await client.save()
                return res.status(429).json({
                    message: 'Account locked'
                })
            }

            await client.save()

            return res.status(400).json({
                message: 'Invalid Credentials',
                attemptsRemaining: 5 - client.failedLoginAttempts
            })
        }
        if (client.isVerified == false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        client.failedLoginAttempts = 0
        await client.save()

        const token = jwt.sign(
            {id: client._id, role: client.role},
            process.env.SECERT_KEY,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message: 'Login successfull',
            token,
            client
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: `Something went wrong`
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
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

        if (Date.now() > user.otpExpire || otp !== user.otp){
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            })
        }

        const emailData = {
            name: user.fullName,
            otp: OTP
        }
        await brevo(user.email, user.fullName, resetPasswordTemplate(emailData))
         
        user.otp = OTP;
        user.otpExpire = expiresAt;

        await user.save();

        res.status(200).json({
            message: 'Please check your email for password OTP'
        })



    } catch (error) {
        if (isEmailDeliveryError(error)) {
            return res.status(503).json({
                message: "Unable to send password OTP. Please try again."
            })
        }

        console.log(error.message)       
         res.status(500).json({
            message: "Something went wrong"
        })
    }
}



exports.resetPassword = async (req,res) => {
    try {
        const {email, otp, password} = req.body
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
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        
        await user.save()

        await brevo(user.email, user.fullName, resetPasswordSuccessfulTemplate(user.fullName))

        res.status(200).json({
            message: "Password reset successfully"
        })
    
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

