const router = require('express').Router()
const { createAdmin, verifyAdmin, updateProfile, loginClient, forgotPassword, resetPassword } = require('../controller/admin')
const {authenticate} = require('../middleware/auth')
const { createAdminValidator, verifyAdminValidator, loginClientValidator, forgotPasswordValidator, resetPasswordValidator } = require('../middleware/validateAdmin')

router.post('/admin', createAdminValidator, createAdmin)
router.post('/admin/verify', verifyAdminValidator, verifyAdmin)
router.post('/login', loginClientValidator, loginClient)

router.post('/forgot-password', forgotPasswordValidator, forgotPassword)
router.post('/reset-password', resetPasswordValidator, resetPassword)

module.exports = router
