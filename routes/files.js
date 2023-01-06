const router = require('express').Router()
const qr = require("qrcode")
const File = require('../models/file')
const { upload } = require('../utils/multer')
const { uploadS3 } = require('../utils/multer-s3')
const {
  v4: uuid4
} = require('uuid')

router.post('/', (req, res) => {

  upload(req, res, async (err) => {

    if (!req.file) {
      return res.status(400).json({
        error: 'File missing'
      })
    }

    if (err) {
      return res.status(500).send({
        error: err.message
      })
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size
    })

    const response = await file.save();
    const fileUrl = `${process.env.APP_BASE_URL}/files/${response.uuid}`;
    qr.toDataURL(fileUrl, (err, src) => {
      return res.status(200).json({
        file: fileUrl,
        qr: err ? null : src
      });
    });

  })
})

router.post('/s3', uploadS3, async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: 'File missing'
    })
  }

  const file = new File({
    filename: req.file.originalname,
    uuid: uuid4(),
    path: req.file.location,
    size: req.file.size,
    s3: true
  })

  const response = await file.save();
  const fileUrl = file.path;
  qr.toDataURL(fileUrl, (err, src) => {
    return res.status(200).json({
      file: fileUrl,
      qr: err ? null : src
    });
  });

})


module.exports = router;