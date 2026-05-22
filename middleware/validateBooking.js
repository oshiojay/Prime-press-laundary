const Joi = require('joi')

exports.createBookingValidator = (req, res, next) => {

    const schema = Joi.object({
        fullName: Joi.string().trim().min(2).required().messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters long',
            'any.required': 'Full name is required'
        }),

        phoneNumber: Joi.string().trim().min(11).max(15).required().messages({
            'string.base': 'Phone number must be a string',
            'string.empty': 'Phone number is required',
            'string.min': 'Phone number must be at least 11 characters',
            'string.max': 'Phone number cannot be more than 15 characters',
            'any.required': 'Phone number is required'
        }),

        address: Joi.string().trim().required().messages({
            'string.base': 'Address must be a string',
            'string.empty': 'Address is required',
            'any.required': 'Address is required'
        }),

        instruction: Joi.string().trim().required().messages({
            'string.base': 'Instruction must be a string',
            'string.empty': 'Instruction is required',
            'any.required': 'Instruction is required'
        }),

        dateAndTime: Joi.date().required().messages({
            'date.base': 'Date and time must be valid',
            'any.required': 'Date and time is required'
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

exports.getOneBookingValidator = (req, res, next) => {

    const schema = Joi.object({
        id: Joi.string().hex().length(24).required().messages({
            'string.empty': 'Booking id is required',
            'string.length': 'Invalid booking id',
            'string.hex': 'Invalid booking id',
            'any.required': 'Booking id is required'
        })
    })

    const { error } = schema.validate(req.params)

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}







