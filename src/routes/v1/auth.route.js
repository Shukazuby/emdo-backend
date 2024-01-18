const express = require('express');
const authController = require('../../controllers/auth.controller');


const router = express.Router();

router.post('/employers/register', authController.createEmployer);
router.post('/employers/login',authController.employerLogin);

module.exports = router;
