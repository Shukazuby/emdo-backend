const express = require('express')
const jobController = require('../../controllers/job.controller')
const auth = require('../../middlewares/auth');


const router = express.Router()

router.post('/post', auth('postJobs'), jobController.createJob)
router.post('/bookmark/:jobId', auth(), jobController.bookmarkJob)
router.get('/bookmark/:jobId', auth(), jobController.getABookmarkedJob)
router.get('/bookmark/job/all', auth(), jobController.getBookmarkedJobs)
router.get('/new', jobController.newStatus)
router.get('/status',  jobController.getJobs)
router.get('/ongoing',  jobController.ongoingStatus)
router.get('/complete',  jobController.completeStatus)
router.get('/employer', auth(), jobController.getJobsByAnEmployer);
router.get('/all/jobs', auth('getAllJobs'), jobController.getAllJobs);
router.get('/active/jobs', auth('getAllJobs'), jobController.getActiveJobs);
router.get('/cancelled/jobs', auth('getAllJobs'), jobController.getCancelledJobs);
router.get('/completed/jobs', auth('getAllJobs'), jobController.getCompletedJobs);
router.get('/active/employer/:employerId', auth('getAllJobs'), jobController.getActiveJobsByEmployerId);
router.get('/cancelled/employer/:employerId', auth('getAllJobs'), jobController.getCancelledJobsByEmployerId);
router.get('/completed/employer/:employerId', auth('getAllJobs'), jobController.getCompletedJobsByEmployerId);
router.get('/active/employee/:employeeId', auth('getAllJobs'), jobController.getActiveJobsByEmployeeId);
router.get('/cancelled/employee/:employeeId', auth('getAllJobs'), jobController.getCancelledJobsByEmployeeId);
router.get('/completed/employee/:employeeId', auth('getAllJobs'), jobController.getCompletedJobsByEmployeeId);
router.get('/:jobId', auth(), jobController.getJob);
router.get('/filters/all', jobController.allFilter)
router.patch('/:jobId', auth(),  jobController.updateJob)
router.delete('/:jobId', auth(), jobController.deleteJob);
router.delete('/bookmark/:jobId', auth(), jobController.deleteABookmarkedJob)

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

/**
 * @swagger
 * /jobs/new:
 *   get:
 *     summary: Get new posted jobs
 *     description: Retrieve new posted jobs.
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of jobs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /jobs/complete:
 *   get:
 *     summary: Get filtered completed jobs
 *     description: 
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /jobs/ongoing:
 *   get:
 *     summary: Get filtered ongoing jobs
 *     description: 
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /jobs/employer:
 *   get:
 *     summary: Get a job by employer
 *     description: 
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /jobs/{jobId}:
 *   get:
 *     summary: Get a job
 *     description: Logged in employers can fetch only their own job information. Only admins can fetch other jobs.
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: job id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/** 
 * @swagger
 * /jobs/{jobId}:
 *   patch:
 *     summary: Update a job
 *     description: Logged in employers can only update their own information. Only admins can update other jobs.
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: job id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
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
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/** 
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: Delete a job
 *     description: Logged in employers can delete only their jobs. Only admins can delete other jobs.
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: job id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /jobs/filters/all:
 *   get:
 *     summary: Get filtered jobs
 *     description: Retrieve posted jobs by selected filters.
 *     tags: [job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: 
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: 
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: 
 *       - in: query
 *         name: date
 *         schema:
 *           type: date
 *         description: 
 *       - in: query
 *         name: time
 *         schema:
 *           type: date
 *         description: 
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: 
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /jobs/status:
 *   get:
 *     summary: Get jobs based on status
 *     description: Retrieve jobs.
 *     tags: [jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status new
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of jobs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 status:
 *                   type: string
 *                   example: new
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */


