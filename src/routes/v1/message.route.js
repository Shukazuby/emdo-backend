const express = require('express')
const {messageController} = require('../../controllers/')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.get('/:receiverId', auth(), messageController.getBothMessages)
router.get('/receivers/', messageController.getAllReceiversBySenderId)

module.exports = router

