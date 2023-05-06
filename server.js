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
const cartRoutes = require('./routes/cart')
const stripe = require('stripe')('sk_test_51MepbbACob0kXxS0LOl8x3By9YVUXSP3n69QT4uCxfatIrpBJsyDUNSq1qtRXrW3vXXTrsZNNKqYXaWidn1DgMHZ00hWHUVQu4');

const YOUR_DOMAIN = 'http://localhost:8000';


require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: 'mongodb+srv://H:0wbHrzHVOFDRgG1J@techton.rhyn3i2.mongodb.net/?retryWrites=true&w=majority' }),
    })
);
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/cart', cartRoutes)

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT ${process.env.PORT}, you better catch it!`)
})    