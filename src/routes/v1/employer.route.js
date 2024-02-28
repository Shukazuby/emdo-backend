const express = require('express')
const employerController = require('../../controllers/employer.controller')
const auth = require("../../middlewares/auth");


const router = express.Router()

// router.patch('/:id', employerController.updateEmployer)
// router.get('/:id', employerController.getEmployerByUserId)
router.get("/emp/emp/:employerId", auth('getEmployerData'), employerController.adminGetAllEmployerData);
router.get('/emp/emp/all', auth('getAllEmployers'), employerController.getAllEmployers)
router.get('/emp/approved', auth('getApprovedEmployers'), employerController.getApprovedEmployers)
router.get('/emp/approved/:employerId', auth('getApprovedEmployers'), employerController.getAnApprovedEmployer)
router.delete('/emp/approved/:employerId', auth('getApprovedEmployers'), employerController.deleteAnApprovedEmployer)

module.exports = router

/**
 * @swagger
 * /employers/emp/emp/all:
 *   get:
 *     summary: Get all employers by admin
 *     description: 
 *     tags: [admin]
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
 * /employers/emp/emp/approved:
 *   get:
 *     summary: Get all approved employers by admin
 *     description: 
 *     tags: [admin]
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
 * /employers/emp/approved/{employerId}: 
 *   get:
 *     summary: get an approved employer by admin
 *     description: 
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: employer id
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
 * /employers/emp/emp/{employerId}:
 *   get:
 *     summary: Get an employer details by admin
 *     description: 
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: employer id
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
 * /employers/emp/approved/{employerId}:
 *   delete:
 *     summary: delete an approved employer details by admin
 *     description: 
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: employer id
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

