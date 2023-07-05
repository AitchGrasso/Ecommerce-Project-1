const {products, getProducts} = require('../models/Products');
const {userCart, getNumUserItems} = require('../models/cart');
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {
    getCheckout: (req, res) => {
        res.render("checkout.ejs", { userCart, numCartItems: getNumUserItems() });
    },
    addItem: (req, res) => {
        getProducts()
        // check if user already has one in cart.
        const cartIndex = userCart.findIndex((item) => item.id === req.params.id);
      
        // user has item in cart already, increase qty.
        if (cartIndex > -1) {
          userCart[cartIndex].quantity++;
          return res.json({
            code: 300,
            message: "Item added to cart",
          });
        }
      
        // user does not have this item in their cart yet.
        const item = products.find((item) => item.id === req.params.id);

        console.log(item)

        if (item) {
          userCart.push({ ...item, quantity: 1 });
          return res.json({
            code: 300,
            message: "Item added to cart",
          });
        }
      
        // invalid ID.
        return res.json({
          code: 404,
          message: "Incorrect item ID",
        });
    },
    startCheckout: async (req, res) => {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            ...userCart.map((item) => {
              return {
                price: item.default_price.id,
                quantity: item.quantity,
              };
            }),
          ],
          // One-time payment, not recurring.
          mode: "payment",
          // URL customer redirects to upon successful payment.
          success_url: "http://localhost:8000/payment_success",
          // URL customer redirects to when they cancel checkout.
          cancel_url: "http://localhost:8000/",
        });
      
        // Go to stripe
        res.redirect(303, session.url);
    },
    paymentSuccess: async (req, res) => {
        userCart.length = 0;
        return res.render("payment_success.ejs");
  }
}