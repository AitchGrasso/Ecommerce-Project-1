const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

router.get("/", checkoutController.getCheckout);
router.get("/api/add/:id", checkoutController.addItem);
router.post("/stripe-checkout", checkoutController.startCheckout);
router.get("/payment_success", checkoutController.paymentSuccess);

module.exports = router;
