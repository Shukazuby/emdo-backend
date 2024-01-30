const express = require("express");
const employeeController = require("../../controllers/employee.controller");
const auth = require("../../middlewares/auth");
const { multerUploads } = require("../../config/multer");

const router = express.Router();
// Post Request
router.post("/cert", auth(), multerUploads, employeeController.addEmpCert);
router.post("/history", auth(), employeeController.addEmpHistory);
router.post("/referee", auth(), employeeController.addReferee);

// Get Request
router.get("/:id", employeeController.getEmployeeByUserId);
router.get('/history', auth(), employeeController.getHistoryByAnEmployee);
router.get('/history/:empHistoryId', auth(),employeeController.getEmpHistory);

router.get('/cert', auth(), employeeController.getCertByAnEmployee);
router.get('/cert/:certId', auth(),employeeController.getCert);

router.get('/referee', auth(), employeeController.getRefereeByAnEmployee);
router.get('/referee/:refereeId', auth(),employeeController.getReferee);

// Patch Request
router.patch("/:id", employeeController.updateEmployee);
router.patch('/history/:empHistoryId', auth(),  employeeController.updateHistory)
router.patch('/cert/:certId', auth(),  employeeController.updateCert)
router.patch('/referee/:refereeId', auth(),  employeeController.updateReferee)

// Delete Request
router.delete('/history/:empHistoryId', auth(), employeeController.deleteHistory);
router.delete('/cert/:certId', auth(), employeeController.deleteCert);
router.delete('/referee/:refereeId', auth(), employeeController.deleteReferee);

module.exports = router;

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get an employee details
 *     description:
 *     tags: [employee]
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
