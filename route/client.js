const router = require('express').Router()
const { createClient, verifyClient, updateProfile } = require('../controller/client')
const {upload} = require('../middleware/multer')

router.post('/client', createClient)
router.post('/client/verify', verifyClient)
router.put('/update/:id', upload.any(), updateProfile)

module.exports = router
