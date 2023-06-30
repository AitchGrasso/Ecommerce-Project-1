const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const webhookController = require("../controllers/webhookController");
const {userCart, getNumUserItems} = require('../models/Cart');
const {products, getProducts} = require('../models/Products');
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", homeController.getIndex);
router.get("/products", homeController.getProducts);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.post("/webhook", webhookController.handleWebhookRoute);
// Set up the route with express.raw middleware

module.exports = router;
