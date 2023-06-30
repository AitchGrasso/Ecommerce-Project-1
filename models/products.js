const stripe = require("stripe")(process.env.STRIPE_API_KEY);

///////////////////////////////////////////////////////////////////////////////
// Products available for sale (loads from stripe on server startup).
///////////////////////////////////////////////////////////////////////////////

const products = [];

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
    const productsResponse = await stripe.products.list({
      expand: ["data.default_price"],
    });
    
    return productsResponse.data;
}

module.exports = { products, getProducts };