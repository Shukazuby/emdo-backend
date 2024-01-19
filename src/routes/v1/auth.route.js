const express = require('express');
const authController = require('../../controllers/auth.controller');


const router = express.Router();

router.post('/employers/register', authController.createEmployer);
router.post('/login',authController.login);
router.post('/reset',authController.resetPassword);
router.post('/forget',authController.forgotPassword);
router.post('/verify',authController.verifyEmail);


module.exports = router;
