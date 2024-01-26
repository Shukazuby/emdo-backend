const express = require('express')
const {teamManagerController} = require('../../controllers/')

const router = express.Router()
router.post('/manager', teamManagerController.createTeamManager);

module.exports = router

