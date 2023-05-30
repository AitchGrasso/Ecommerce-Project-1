const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
// const checkoutRoutes = require('./routes/checkout')
// const loginRoutes = require('./routes/login')
require('dotenv').config({path: './config/.env'})
const PORT = process.env.PORT
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_KEY;
const ejs = require('ejs');

// In /public, set .js file's 'Content-type" to behavioral
app.use('/public', express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
}));

// Passport config
require('./config/passport')(passport)

connectDB()

// Using EJS for views
app.set('view engine', 'ejs')

// Using HTML for views
app.set('view engine', 'html');

//TODO: ???
app.engine('html', ejs.renderFile);

// Static Folder, css, js files
app.use(express.static('public'))

// Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logging
app.use(logger('dev'))

// Session Setup - stored in MongoDB
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING}),
    })
);
  
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, ect...
app.use(flash())

app.get('/cart_styles.css', (req, res) => {
	res.type('text/css');
	res.sendFile('/path/to/cart_styles.css');
  });

// Setup Routes For Which The Server Is Listening
// app.use('/', mainRoutes)
// app.use('/checkout', checkoutRoutes)
///////////////////////////////////////////////////////////////////////////////
// Products available for sale (loads from stripe on server startup).
///////////////////////////////////////////////////////////////////////////////
const products = [];

///////////////////////////////////////////////////////////////////////////////
// User Cart
///////////////////////////////////////////////////////////////////////////////
const userCart = [];

///////////////////////////////////////////////////////////////////////////////
// Helper Functions
///////////////////////////////////////////////////////////////////////////////
async function getProducts() {
	// You can't get products with prices, instead you have to get prices
	// with products???
	// const prices = await stripe.prices.list({
	// 	expand: ['data.product'],
	// });
	// const json = await prices.json();
	const products = await stripe.products.list({
		expand: ['data.default_price'],
	});
	console.log(products.data[1])
	return products.data;
}

function getNumUserItems() {
	if (userCart.length === 0) return 0;
	return userCart.reduce((acc, cur) => acc + cur.quantity, 0);
}

async function fulfillOrder(session) {
	const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
		session.id, {
			expand: ['line_items'],
		}
	);
	const lineItems = sessionWithLineItems.line_items;
	console.log("/////////////////////////////////////////////////////")
	console.log("// Fulfill Order                                   //");
	console.log("/////////////////////////////////////////////////////")
	console.log(lineItems);
	console.log('\r\n');
}

async function createOrder(session) {
	console.log("/////////////////////////////////////////////////////")
	console.log("// Create Order                                    //");
	console.log("/////////////////////////////////////////////////////")
	console.log('\r\n');
}

async function sendFailedPaymentEmail(session) {
	console.log("/////////////////////////////////////////////////////")
	console.log("// FAILED PAYMENT - Email Customer                 //");
	console.log("/////////////////////////////////////////////////////")
	console.log('\r\n');
}

///////////////////////////////////////////////////////////////////////////////
// Routes
///////////////////////////////////////////////////////////////////////////////

app.get('/', async (req, res) => {
	res.render('index.ejs', { products, numCartItems: getNumUserItems() });
}); 
app.get('/login', async (req, res) => {
	res.render('login.ejs', { products, numCartItems: getNumUserItems() });
}); 
app.get('/signup', async (req, res) => {
	res.render('signup.ejs', { products, numCartItems: getNumUserItems() });
}); 
app.use('/login', mainRoutes)
app.use('/signup', mainRoutes)
app.post('/signup', mainRoutes)
app.post('/login', mainRoutes)

app.get('/products', async (req, res) => {
	res.render('products.ejs', { products, numCartItems: getNumUserItems() });
});


// User checkout page
app.get('/checkout', (req, res) => {
	res.render('checkout.ejs', { userCart, numCartItems: getNumUserItems() });
})

// API call to add an item to cart
app.get('/api/add/:id', (req, res) => {
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
app.post('/stripe-checkout', async(req, res) => {
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
app.get('/payment_success', async(req, res) => {
	userCart.length = 0;
	return res.render('payment_success.ejs');
})

// Webhook that's called after customer payment.
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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

app.listen(PORT, () => {
	// Load products from stripe.
	getProducts().then(items => products.push(...items));

	console.log("app running on " + PORT);
});
