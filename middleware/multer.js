const multer = require('multer')

exports.upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './assets')
        },
        filename: function (req, file, cb) {
           // const uniqueSuffix = 'oshio'
            // console.log(file)
            cb(null, file.filename + '.' + file.mimetype.split("/")[1])
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