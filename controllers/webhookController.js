const stripe = require('stripe');
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_KEY;
const { fulfillOrder, createOrder, sendFailedPaymentEmail } = require('../controllers/order');

// Webhook that's called after customer payment.

async function handleWebhookRoute(req, res){
    const payload = req.body;
    const sig = req.headers["stripe-signature"];
  
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
      case "checkout.session.completed": {
        console.log("/////////////////////////////////////////////////////");
        console.log("// Event: checkout.session.completed               //");
        console.log("/////////////////////////////////////////////////////");
        console.log("\r\n");
  
        const session = event.data.object;
  
        // Create an order in the database that is marked as waiting for payment,
        // since the payment may be delayed due to various factors.
        createOrder(session);
  
        // If the order is paid, fulfill it. If it's pending, don't.
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }
        break;
      }
  
      // A delayed payment has finally succeeded.
      case "checkout.session.async_payment_succeeded": {
        console.log("/////////////////////////////////////////////////////");
        console.log("// Event: checkout.session.async_payment_succeeded //");
        console.log("/////////////////////////////////////////////////////");
        console.log("\r\n");
  
        const session = event.data.object;
        fulfillOrder(session);
        break;
      }
  
      // A delayed payment has failed.
      case "checkout.session.async_payment_failed": {
        console.log("/////////////////////////////////////////////////////");
        console.log("// Event: checkout.session.async_payment_failed    //");
        console.log("/////////////////////////////////////////////////////");
        console.log("\r\n");
  
        const session = event.data.object;
        sendFailedPaymentEmail(session);
        break;
      }
  
      default: {
        console.log("/////////////////////////////////////////////////////");
        console.log("// Unhandled Event                                 //");
        console.log("/////////////////////////////////////////////////////");
        console.log(`${event.type}\r\n`);
      }
    }
  
    res.status(200).send();
};

module.exports = {
    handleWebhookRoute
};