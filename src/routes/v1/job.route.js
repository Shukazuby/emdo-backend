const express = require('express')
const jobController = require('../../controllers/job.controller')
const auth = require('../../middlewares/auth');


const router = express.Router()

router.post('/post', auth('postJob'), jobController.createJob)
router.get('/new',  jobController.getJobs)
// router.get('/ongoing',  jobController.ongoingStatus)
// router.get('/complete',  jobController.completeStatus)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job posting
 */

/**
 * @swagger
 * /jobs/post:
 *   post:
 *     summary: Create job
 *     description: 
 *     tags: [ Job]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - noOfStaff
 *               - shiftStartDate
 *               - shiftEndDate
 *               - hourlyPay
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                  type: string
 *               noOfStaff:
 *                  type: string
 *               shiftStartDate:
 *                  type: string
 *               shiftEndDate:
 *                  type: string
 *               hourlyPay:
 *                  type: string
 *             example:
 *               title: fake title
 *               description: fake description
 *               location: fake location
 *               noOfStaff: 11-50
 *               shiftStartDate: 2024-01-27T06:46:11.755Z
 *               shiftEndDate: 2024-01-30T06:46:11.755Z
 *               hourlyPay: 600
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
