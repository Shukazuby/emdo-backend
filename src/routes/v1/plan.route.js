const express = require("express");
const { planController} = require("../../controllers/");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post('/add', auth('addPlan'), planController.plans)
router.post("/subscribe", auth('subscribe'), planController.subscribe);
router.get("/verify", auth(), planController.verifyPayment);
router.get("/payments", auth('getPayments'), planController.getPayments);
router.get("/payments/:employeeId", auth('getPaymentsByEmployeeId'), planController.getPaymentsByEmployeeId);
router.get("/pay/:paymentId", auth('getPaymentsById'), planController.getPaymentById);
router.get("/employee/pay", auth('getPayment'), planController.getAllPaymentByEmployee);
router.get("/employee/:paymentId", auth('getPayment'), planController.getAPaymentByEmployee);


module.exports = router

/**
 * @swagger
 * /plan/add:
 *   post:
 *     summary: Create plans
 *     description: 
 *     tags: [ plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planName
 *               - priceId
 *               - billingCycle
 *               - amount
 *             properties:
 *               planName:
 *                 type: string
 *               priceId:
 *                 type: string
 *               billingCycle:
 *                  type: string
 *               amount:
 *                  type: string
 *             example:
 *               planName: fake name
 *               priceId: fake 
 *               billingCycle: fake
 *               amount: fake
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
 * /plan/subscribe:
 *   post:
 *     summary: Subscribe a plan
 *     description: Subscribe to a new plan.
 *     tags: [plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: plan
 *         required: true
 *         schema:
 *           type: integer
 *         description: plan id
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
 *                 plan:
 *                   type: Integer
 *                   example: 1 
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /plan/verify:
 *   get:
 *     summary: Verify a plan payment
 *     description: Verify the payment with sessionId retrieved from subscribed plan.
 *     tags: [plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: session id
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
 *                 sessionId:
 *                   type: string
 *                   example: huhja78kksagwe9s5hFkjRjj
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /plan/payments:
 *   get:
 *     summary: get all payments
 *     description: get all payments
 *     tags: [plan]
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
 * /plan/payments/{employeeId}:
 *   get:
 *     summary: get an employee payment history
 *     description: fetch an employee payment history
 *     tags: [plan]
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

/**
 * @swagger
 * /plan/pay/{paymentId}:
 *   get:
 *     summary: get a payment by admin
 *     description: get a payment details by admin
 *     tags: [plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: payment id
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
 *                 paymentId:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /plan/employee/pay:
 *   get:
 *     summary: get all payment by employee
 *     description: fetch all payments made by the logged in employee
 *     tags: [plan]
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
 * /plan/employee/{paymentId}:
 *   get:
 *     summary: get a payment by employee
 *     description: get a payment details
 *     tags: [plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: payment id
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
 *                 paymentId:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */



