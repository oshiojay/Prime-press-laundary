const fs = require('fs')
const path = require('path')
const multer = require('multer')

exports.upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            const uploadPath = './assets'
            fs.mkdirSync(uploadPath, { recursive: true })
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            const extension = path.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`
            cb(null, `${file.fieldname}-${Date.now()}${extension}`)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 
    },
    fileFilter: (req, file, cb)=>{
        if (!file.mimetype.startsWith('image/')){
            cb(new Error('Only image files are allowed'))
        }else {
            cb(null, true)
        }
    }
})
