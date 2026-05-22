const router = require('express').Router()
const { createBooking, getAllBookings, getOneBooking } = require('../controller/booking')
const{createBookingValidator,getOneBookingValidator} = required('../middleware/validatorBooking')



router.post('/booking',createBookingValidator, createBooking)
router.get('/bookings', getAllBookings)
router.get('/one-booking', getOneBookingValidator, getOneBooking)

module.exports = router