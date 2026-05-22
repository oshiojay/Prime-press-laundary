const bookingModel = require('../model/booking')


exports.createBooking = async (req, res) => {
    try {
        const {fullName, phoneNumber, address, instruction, dateAndTime} = req.body
        const newBooking = new bookingModel({
            fullName,
            phoneNumber,
            address,
            instruction,
            dateAndTime
        })
        await newBooking.save()
        res.status(201).json({
            message: "Booking created successfully",
            data: newBooking
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().sort({createdAt: -1})
        res.status(200).json({
            message: "Bookings retrieved successfully",
            data: bookings,
            count: bookings.length
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

exports.getOneBooking = async (req, res) => {
    try {
        const oneBooking = await bookingModel.findOne()
        res.status(200).json({
            message: "one booking retrieved successfully",
            data: oneBooking
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}