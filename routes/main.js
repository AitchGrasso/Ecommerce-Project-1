const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/', async (req, res) => {
	res.render('index.ejs', { products, numCartItems: getNumUserItems() });
});

module.exports = router