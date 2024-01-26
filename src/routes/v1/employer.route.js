const express = require('express')
const employerController = require('../../controllers/employer.controller')

const router = express.Router()

router.patch('/:id', employerController.updateEmployer)
router.get('/:id', employerController.getEmployerByUserId)

module.exports = router

/**
 * @swagger
 * /employers/{id}:
 *   get:
 *     summary: Get an employer details
 *     description: 
 *     tags: [employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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

