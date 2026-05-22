const router = require('express').Router()
const { createBooking, getAllBookings, getOneBooking } = require('../controller/booking')

router.post('/booking', createBooking)
router.get('/bookings', getAllBookings)
router.get('/one-booking', getOneBooking)

module.exports = router