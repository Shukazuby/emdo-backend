const express = require('express')
const reviewController = require('../../controllers/review.controller')
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/:employeeId', auth('addReview'), reviewController.addReview)
router.get('/employee', auth('getReviews'), reviewController.getReviewByEmployee)
router.get('/reviews', auth('getEmployeeReviews'), reviewController.getAllReviewsByAdmin)
router.get('/employees/:employeeId', auth('getEmployeeReviews'), reviewController.getEmployeeAllReviewsByAdmin)
// router.get('/:employeeId', auth(), reviewController.getReviews)

module.exports = router

/**
 * @swagger
 * /review/{employeeId}:
 *   post:
 *     summary: Create review
 *     description: add a review and ratings for an employee
 *     tags: [ review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: employee id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stars
 *               - message
 *             properties:
 *               stars:
 *                 type: integer
 *               message:
 *                 type: string
 *             example:
 *               stars: 1
 *               message: Loves her diligent she is 
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
 * /review/employee:
 *   get:
 *     summary: get all reviews by logged in employee
 *     description: fetch all reviews associated to the logged in employee
 *     tags: [review]
 *     security:
 *       - bearerAuth: []
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /review/reviews:
 *   get:
 *     summary: get all reviews by admin
 *     description: fetch all reviews in the database by admin
 *     tags: [review]
 *     security:
 *       - bearerAuth: []
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /review/employees/{employeeId}:
 *   get:
 *     summary: get all reviews of an employee by admin
 *     description: fetch all reviews associated to an employee by admin
 *     tags: [review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: employee id
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
 *                 employeeId:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
