const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const auth = require('../../middlewares/auth');
const { multerUploads } = require('../../config/multer');


const router = express.Router()

router.post('/file', auth(), multerUploads, uploadController.upload)

module.exports = router
