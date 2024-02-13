const express = require("express");
const { planController} = require("../../controllers/");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post('/add', planController.plans)
router.post("/subscribe", auth(), planController.subscribe);
router.get("/verify", auth(), planController.verifyPayment);


module.exports = router