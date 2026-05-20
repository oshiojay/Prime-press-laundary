const router = require('express').Router()
const { createAdmin, verifyAdmin, updateProfile, loginClient, forgotPassword, resetPassword } = require('../controller/admin')
const {authenticate} = require('../middleware/auth')

router.post('/admin', createAdmin)
router.post('/admin/verify', verifyAdmin)
router.post('/login',  loginClient)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
