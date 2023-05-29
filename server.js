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
const checkoutRoutes = require('./routes/checkout')
const loginRoutes = require('./routes/login')
require('dotenv').config({path: './config/.env'})
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

// Setup Routes For Which The Server Is Listening
app.use('/', mainRoutes)
app.use('/checkout', checkoutRoutes)

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
	const products = await stripe.products.list({
		expand: ['data.default_price'],
	});
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

// Run server.
app.listen(process.env.PORT, () => {
	// Load products from stripe.
	getProducts().then(items => products.push(...items));

	console.log(`Server is running on PORT ${process.env.PORT}, you better catch it!`)
});

//////////////////////////STRIPE CHANGES


// app.listen(process.env.PORT, ()=>{
//     console.log(`Server is running on PORT ${process.env.PORT}, you better catch it!`)
// })    