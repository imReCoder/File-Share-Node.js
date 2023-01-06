const multer = require('multer')

const path = require('path')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'shared/'),
    filename: (req, file, cb) => {
        const uniqname = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqname)
    }
})

let upload = multer({
    storage,
    limits: {
        fileSize: 100000 * 100 // 100 MB
    }
}).single('myFile')

module.exports = {
    upload
}