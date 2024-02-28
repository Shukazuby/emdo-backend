const express = require('express')
const {adminController} = require('../../controllers/')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.post('/', auth(), adminController.addNewAdmin)
router.patch('/', auth(), adminController.updateAdmins)
router.patch('/newAdmin', auth(), adminController.updateNewAdminsByUserId)
router.patch('/:adminId', auth(), adminController.updateNewAdmin)

module.exports = router

