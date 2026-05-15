const router = require('express').Router()
const { createClient, verifyClient } = require('../controller/client')
const {upload} = require('../middleware/multer')

router.post('/client', createClient)
router.post('/client/verify', verifyClient)

module.exports = router