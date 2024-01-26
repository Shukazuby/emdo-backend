const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const auth = require('../../middlewares/auth');
const { multerUploads } = require('../../config/multer');


const router = express.Router()

router.post('/file', auth(), multerUploads, uploadController.upload)

module.exports = router


/**
 * @swagger
 * /uploads/file:
 *   post:
 *     summary: upload a file
 *     description: Only users can upload a file.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - path
 *             properties:
 *               fileName:
 *                 type: string
 *               path:
 *                 type: string
 *             example:
 *               fileName: zuby.pdf
 *               path: https://cloudinary/zuby.pdf
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
