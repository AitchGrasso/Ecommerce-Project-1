const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, cartController.getCart)

router.post('/createCart', cartController.createCart)

router.put('/markComplete', cartController.markComplete)

router.put('/markIncomplete', cartController.markIncomplete)

router.delete('/deleteCart', cartController.deleteCart)

module.exports = router

router.get('/products', async (req, res) => {
	res.render('products.ejs', { products, numCartItems: getNumUserItems() });
});

// User checkout page
router.get('/checkout', (req, res) => {
	res.render('checkout.ejs', { userCart, numCartItems: getNumUserItems() });
})

// API call to add an item to cart
router.get('/api/add/:id', (req, res) => {
	// check if user already has one in cart.
	const cartIndex = userCart.findIndex(
		item => item.id === req.params.id
	);

	// user has item in cart already, increase qty.
	if (cartIndex > -1) {
		userCart[cartIndex].quantity++;
		return res.json({
			code: 300,
			message: 'Item added to cart',
		})
	}

	// user does not have this item in their cart yet.
	const item = products.find(item => item.id === req.params.id);
	if (item) {
		userCart.push({ ...item, quantity: 1});
		return res.json({
			code: 300,
			message: 'Item added to cart',
		})
	}

	// invalid ID.
	return res.json({
		code: 404,
		message: 'Incorrect item ID',
	})
})

// POST request to start Stripe checkout.
router.post('/stripe-checkout', async(req, res) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			...userCart.map(item => {
				return {
					price: item.default_price.id,
					quantity: item.quantity
				}
			})
		],
		// One-time payment, not recurring.
		mode: 'payment',
		// URL customer redirects to upon successful payment.
		success_url: 'http://localhost:8000/payment_success',
		// URL customer redirects to when they cancel checkout.
		cancel_url: 'http://localhost:8000/',
	});

	// Go to stripe
	res.redirect(303, session.url);
});

// Page customer will see after paying.
router.get('/payment_success', async(req, res) => {
	userCart.length = 0;
	return res.render('payment_success.ejs');
})

// Webhook that's called after customer payment.
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
	const payload = req.body;
	const sig = req.headers['stripe-signature'];

	// Verify the call was from Stripe usign the endpoint secret API key.
	let event;
	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		console.error(err);
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle all payment events.
	switch (event.type) {
		// Checkout has been successfully completed.
		case 'checkout.session.completed': {
			console.log("/////////////////////////////////////////////////////")
			console.log("// Event: checkout.session.completed               //");
			console.log("/////////////////////////////////////////////////////")
			console.log('\r\n');

			const session = event.data.object;

			// Create an order in the database that is marked as waiting for payment,
			// since the payment may be delayed due to various factors.
			createOrder(session);

			// If the order is paid, fulfill it. If it's pending, don't.
			if (session.payment_status === 'paid') {
				fulfillOrder(session);
			}
			break;
		}

		// A delayed payment has finally succeeded.
		case 'checkout.session.async_payment_succeeded': {
			console.log("/////////////////////////////////////////////////////")
			console.log("// Event: checkout.session.async_payment_succeeded //");
			console.log("/////////////////////////////////////////////////////")
			console.log('\r\n');

			const session = event.data.object;
			fulfillOrder(session);
			break;
		}

		// A delayed payment has failed.
		case 'checkout.session.async_payment_failed': {
			console.log("/////////////////////////////////////////////////////")
			console.log("// Event: checkout.session.async_payment_failed    //");
			console.log("/////////////////////////////////////////////////////")
			console.log('\r\n');

			const session = event.data.object;
			sendFailedPaymentEmail(session);
			break;;
		}

		default: {
			console.log("/////////////////////////////////////////////////////")
			console.log("// Unhandled Event                                 //");
			console.log("/////////////////////////////////////////////////////")
			console.log(`${event.type}\r\n`);
		}
	}

	res.status(200).send();
})