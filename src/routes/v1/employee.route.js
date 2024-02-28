const express = require("express");
const {employeeController} = require("../../controllers/");
const auth = require("../../middlewares/auth");
const { multerUploads } = require("../../config/multer");

const router = express.Router();
// Post Request
router.post("/cert", auth(), multerUploads, employeeController.addEmpCert);
router.post("/history", auth(), employeeController.addEmpHistory);
router.post("/referee", auth(), employeeController.addReferee);
router.post("/cv", auth(), multerUploads, employeeController.addCv);
router.post("/rtw", auth(), multerUploads, employeeController.addRtw);

// Get Request
router.get("/:id", employeeController.getEmployeeByUserId);

router.get('/history', auth(), employeeController.getHistoryByAnEmployee);
router.get('/history/:empHistoryId', auth(),employeeController.getEmpHistory);

router.get('/cv', auth(), employeeController.getCvByAnEmployee);
router.get('/cv/:cvId', auth(),employeeController.getCv);

router.get('/rtw', auth(), employeeController.getRtwByAnEmployee);
router.get('/rtw/:rtwId', auth(),employeeController.getRtw);

router.get('/cert', auth(), employeeController.getCertByAnEmployee);
router.get('/cert/:certId', auth(),employeeController.getCert);

router.get('/referee', auth(), employeeController.getRefereeByAnEmployee);
router.get('/referee/:refereeId', auth(),employeeController.getReferee);

// Admin Rights
router.get('/emp/status', auth('getNewEmployee'), employeeController.getAllNewEmployees)
router.get("/emp/emp/:employeeId", auth('getEmployeeData'), employeeController.adminGetAllEmployeeData);
router.get('/emp/all', auth('getAllEmployees'), employeeController.getAllEmployees)
router.get('/emp/approved', auth('getApprovedEmployees'), employeeController.getApprovedEmployees)
router.get('/emp/approved/:employeeId', auth('getApprovedEmployees'), employeeController.getAnApprovedEmployee)

// Patch Request
router.patch("/:id", employeeController.updateEmployee);
router.patch('/history/:empHistoryId', auth(),  employeeController.updateHistory)
router.patch('/cert/:certId', auth(),  employeeController.updateCert)
router.patch('/referee/:refereeId', auth(),  employeeController.updateReferee)

// Delete Request
router.delete('/history/:empHistoryId', auth(), employeeController.deleteHistory);
router.delete('/cert/:certId', auth(), employeeController.deleteCert);
router.delete('/referee/:refereeId', auth(), employeeController.deleteReferee);
router.delete('/cv/:cvId', auth(), employeeController.deleteCv);
router.delete('/rtw/:rtwId', auth(), employeeController.deleteRtw);
router.delete('/emp/approved/:employeeId', auth('getApprovedEmployees'), employeeController.deleteAnApprovedEmployee);

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
 *           type: integer
 *         description: employee id
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
 * /employees/{id}:
 *   patch:
 *     summary: update an employee details
 *     description:
 *     tags: [employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 * /employees/{id}:
 *   delete:
 *     summary: delete an employee details
 *     description:
 *     tags: [employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 * /employees/history:
 *   post:
 *     summary: Create employee employment history
 *     description: 
 *     tags: [ employee, history]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobTitle
 *               - companyName
 *               - city
 *               - country
 *               - jobDescription
 *               - from
 *               - to
 *             properties:
 *               jobTitle:
 *                 type: string
 *               companyName:
 *                 type: string
 *               city:
 *                  type: string
 *               country:
 *                  type: string
 *               jobDescription:
 *                  type: string
 *               from:
 *                  type: date
 *               to:
 *                  type: date
 *             example:
 *               jobTitle: fake title
 *               companyName: fake name
 *               city: fake
 *               country: fake
 *               jobDescription: fake
 *               from: 2024-01-27T06:46:11.755Z
 *               to: 2024-02-30T06:46:11.755Z
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
 * /employees/history:
 *   get:
 *     summary: Get employee employment history
 *     description: 
 *     tags: [employee, history]
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
 * /employees/{empHistoryId}:
 *   get:
 *     summary: Get an employee history by employeeId
 *     description: 
 *     tags: [employee, history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 * /employees/{empHistoryId}:
 *   patch:
 *     summary: Update an employee employment history
 *     description: 
 *     tags: [employee, history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               jobTitle:
 *                 type: string
 *             example:
 *               jobTitle: fake job title
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
 * /employees/{employeeId}:
 *   delete:
 *     summary: Delete an employee employment history
 *     description: 
 *     tags: [employee, history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: employee id
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
 * /employees/cert:
 *   post:
 *     summary: Create a training and certification
 *     description: 
 *     tags: [ employee, cert]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - certTitle
 *               - issuingOrg
 *               - issueDate
 *               - expirationDate
 *               - credentialId
 *               - credentialUrl
 *             properties:
 *               certTitle:
 *                 type: string
 *               issuingOrg:
 *                 type: string
 *               issueDate:
 *                  type: date
 *               expirationDate:
 *                  type: date
 *               credentialId:
 *                  type: string
 *               credentialUrl:
 *                  type: string
 *             example:
 *               certTitle: fake title
 *               issuingOrg: fake name
 *               issueDate: 2024-01-27T06:46:11.755Z
 *               expirationDate: 2024-02-30T06:46:11.755Z
 *               credentialId: /678A
 *               credentialUrl: https://urlfake.com
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
 * /employees/cert:
 *   get:
 *     summary: Get certification 
 *     description: 
 *     tags: [employee, cert]
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
 * /employees/{certId}:
 *   get:
 *     summary: Get certification by certId
 *     description: 
 *     tags: [employee, cert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: cert id
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
 * /employees/{certId}:
 *   patch:
 *     summary: Update an employee certification and training
 *     description: 
 *     tags: [employee, cert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: cert id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *             example:
 *               jobTitle: fake job title
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
 * /employees/{certId}:
 *   delete:
 *     summary: Delete an employee certification
 *     description: 
 *     tags: [employee, cert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: cert id
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
 * /employees/referee:
 *   post:
 *     summary: Create a referee
 *     description: 
 *     tags: [ employee, referee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - firstName
 *               - lastName
 *               - email
 *               - orgAddress
 *               - phoneNumber
 *               - organization
 *               - position
 *               - city
 *             properties:
 *               title:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                  type: string
 *               email:
 *                  type: string
 *                  format: email
 *               orgAddress:
 *                  type: string
 *               phoneNumber:
 *                  type: string
 *               organization:
 *                  type: string
 *               city:
 *                  type: string
 *             example:
 *               title: fake title
 *               firstName: fake name
 *               lastName: fake
 *               orgAddress: fake
 *               phoneNumber: +234 90
 *               position: head
 *               organization: emdo
 *               city: fct,abuja
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
 * /employees/referee:
 *   get:
 *     summary: Get referee 
 *     description: 
 *     tags: [employee, referee]
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
 * /employees/{refereeId}:
 *   get:
 *     summary: Get employee referee by refereeId
 *     description: 
 *     tags: [employee, referee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: referee id
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
 * /employees/{refereeId}:
 *   patch:
 *     summary: Update an employee referee 
 *     description: 
 *     tags: [employee, referee ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: referee  id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             example:
 *               title: fake title
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
 * /employees/{refereeId}:
 *   delete:
 *     summary: Delete an employee referee
 *     description: 
 *     tags: [employee, referee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: referee id
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
 * /employees/emp/all:
 *   get:
 *     summary: Get all employees by admin
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
 * /employees/emp/approved:
 *   get:
 *     summary: Get all approved employees by admin
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
 * /employees/emp/approved/{employeeId}: 
 *   get:
 *     summary: get an approved employee by admin
 *     description: 
 *     tags: [admin]
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
 * /employees/emp/emp/{employeeId}:
 *   get:
 *     summary: Get an employee details by admin
 *     description: 
 *     tags: [admin]
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
 * /employees/emp/approved/{employeeId}:
 *   delete:
 *     summary: delete an approved employee details by admin
 *     description: 
 *     tags: [admin]
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
 * /employers/emp/status:
 *   get:
 *     summary: Get new employees
 *     description: Retrieve new posted employees.
 *     tags: [admin]
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
 *         description: Maximum number of employees
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

