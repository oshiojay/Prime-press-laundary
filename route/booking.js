const router = require('express').Router()

const { createBooking, getAllBookings, getOneBooking } = require('../controller/booking')
const{createBookingValidator,getOneBookingValidator} = require('../middleware/bookingValidator')



router.post('/booking',createBookingValidator, createBooking)
router.get('/bookings', getAllBookings)
router.get('/one-booking/:id', getOneBookingValidator, getOneBooking)

module.exports = router