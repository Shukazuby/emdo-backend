const express = require('express')
const jobController = require('../../controllers/job.controller')
const auth = require('../../middlewares/auth');


const router = express.Router()

router.post('/post', auth('postJob'), jobController.createJob)

module.exports = router