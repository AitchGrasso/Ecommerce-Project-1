async function fulfillOrder(session) {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      }
    );
    const lineItems = sessionWithLineItems.line_items;
    console.log("/////////////////////////////////////////////////////");
    console.log("// Fulfill Order                                   //");
    console.log("/////////////////////////////////////////////////////");
    console.log(lineItems);
    console.log("\r\n");
}
  
async function createOrder(session) {
    console.log("/////////////////////////////////////////////////////");
    console.log("// Create Order                                    //");
    console.log("/////////////////////////////////////////////////////");
    console.log("\r\n");
}
  
async function sendFailedPaymentEmail(session) {
    console.log("/////////////////////////////////////////////////////");
    console.log("// FAILED PAYMENT - Email Customer                 //");
    console.log("/////////////////////////////////////////////////////");
    console.log("\r\n");
}

module.exports = { fulfillOrder, createOrder, sendFailedPaymentEmail };