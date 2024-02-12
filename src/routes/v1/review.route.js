const express = require('express')
const reviewController = require('../../controllers/review.controller')
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/:employeeId', auth(), reviewController.addReview)
router.get('/employee', auth(), reviewController.getReviewByEmployee)

router.get('/:employeeId', auth(), reviewController.getReviews)

module.exports = router
