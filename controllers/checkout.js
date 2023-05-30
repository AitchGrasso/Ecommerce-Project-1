const Cart = require('../models/Cart')

module.exports = {
    getCart: async (req,res)=>{
        console.log(req.user)
        try{
            const cartItems = await Cart.find({userId:req.user.id})
            const itemsLeft = await Cart.countDocuments({userId:req.user.id,completed: false})
            res.render('cart.ejs', {cart: cartItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createCart: async (req, res)=>{
        try{
            await Cart.create({cart: req.body.cartItem, completed: false, userId: req.user.id})
            console.log('Cart has been added!')
            res.redirect('/cart')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Cart.findOneAndUpdate({_id:req.body.cartIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Cart.findOneAndUpdate({_id:req.body.cartIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteCart: async (req, res)=>{
        console.log(req.body.cartIdFromJSFile)
        try{
            await Cart.findOneAndDelete({_id:req.body.cartIdFromJSFile})
            console.log('Deleted Cart')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    

// app.get('/api/add/:id', (req, res) => {
// 	// check if user already has one in cart.
// 	const cartIndex = userCart.findIndex(
// 		item => item.id === req.params.id
// 	);

// 	// user has item in cart already, increase qty.
// 	if (cartIndex > -1) {
// 		userCart[cartIndex].quantity++;
// 		return res.json({
// 			code: 300,
// 			message: 'Item added to cart',
// 		})
// 	}

// 	// user does not have this item in their cart yet.
// 	const item = products.find(item => item.id === req.params.id);
// 	if (item) {
// 		userCart.push({ ...item, quantity: 1});
// 		return res.json({
// 			code: 300,
// 			message: 'Item added to cart',
// 		})
// 	}

// 	// invalid ID.
// 	return res.json({
// 		code: 404,
// 		message: 'Incorrect item ID',
// 	})
// })

// // POST request to start Stripe checkout.
// app.post('/stripe-checkout', async(req, res) => {
// 	const session = await stripe.checkout.sessions.create({
// 		line_items: [
// 			...userCart.map(item => {
// 				return {
// 					price: item.default_price.id,
// 					quantity: item.quantity
// 				}
// 			})
// 		],
// 		// One-time payment, not recurring.
// 		mode: 'payment',
// 		// URL customer redirects to upon successful payment.
// 		success_url: 'http://localhost:8000/payment_success',
// 		// URL customer redirects to when they cancel checkout.
// 		cancel_url: 'http://localhost:8000/',
// 	});

// 	// Go to stripe
// 	res.redirect(303, session.url);
// });

// // Page customer will see after paying.
// app.get('/payment_success', async(req, res) => {
// 	userCart.length = 0;
// 	return res.render('payment_success.ejs');
// })

// // Webhook that's called after customer payment.
// app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
// 	const payload = req.body;
// 	const sig = req.headers['stripe-signature'];

// 	// Verify the call was from Stripe usign the endpoint secret API key.
// 	let event;
// 	try {
// 		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(400).send(`Webhook Error: ${err.message}`);
// 		return;
// 	}

// 	// Handle all payment events.
// 	switch (event.type) {
// 		// Checkout has been successfully completed.
// 		case 'checkout.session.completed': {
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log("// Event: checkout.session.completed               //");
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log('\r\n');

// 			const session = event.data.object;

// 			// Create an order in the database that is marked as waiting for payment,
// 			// since the payment may be delayed due to various factors.
// 			createOrder(session);

// 			// If the order is paid, fulfill it. If it's pending, don't.
// 			if (session.payment_status === 'paid') {
// 				fulfillOrder(session);
// 			}
// 			break;
// 		}

// 		// A delayed payment has finally succeeded.
// 		case 'checkout.session.async_payment_succeeded': {
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log("// Event: checkout.session.async_payment_succeeded //");
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log('\r\n');

// 			const session = event.data.object;
// 			fulfillOrder(session);
// 			break;
// 		}

// 		// A delayed payment has failed.
// 		case 'checkout.session.async_payment_failed': {
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log("// Event: checkout.session.async_payment_failed    //");
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log('\r\n');

// 			const session = event.data.object;
// 			sendFailedPaymentEmail(session);
// 			break;;
// 		}

// 		default: {
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log("// Unhandled Event                                 //");
// 			console.log("/////////////////////////////////////////////////////")
// 			console.log(`${event.type}\r\n`);
// 		}
// 	}

// 	res.status(200).send();
// })