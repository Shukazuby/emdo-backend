const express = require('express')
const employerController = require('../../controllers/employer.controller')

const router = express.Router()

router.patch('/:id', employerController.updateEmployer)

module.exports = router