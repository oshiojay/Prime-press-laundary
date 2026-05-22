const Joi = require('joi')

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/

exports.createAdminValidator = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().trim().min(2).required().messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters long',
            'any.required': 'Full name is required'
        }),
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and include upper and lower case'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.verifyAdminValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        otp: Joi.string().trim().length(6).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 characters long',
            'any.required': 'OTP is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.loginClientValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.forgotPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.resetPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        otp: Joi.string().trim().length(6).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 characters long',
            'any.required': 'OTP is required'
        }),
        password: Joi.string().pattern(passwordPattern).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and include upper and lower case'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}
















