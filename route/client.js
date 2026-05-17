const router = require('express').Router()
const { createClient, verifyClient, forgotPassword, resetPassword } = require('../controller/client')
const {upload} = require('../middleware/multer')

router.post('/client', createClient)
router.post('/client/verify', verifyClient)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword);

module.exports = router