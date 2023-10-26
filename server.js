const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const checkoutRoutes = require("./routes/checkout");
const { products, getProducts } = require("./models/products");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const webhookController = require("./controllers/webhookController"); // Import the webhook controller

require("dotenv").config({ path: "./config/.env" });
const PORT = process.env.PORT;

const ejs = require("ejs");

// In /public, set .js file's 'Content-type" to behavioral
app.use(
  "/public",
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Passport config
require("./config/passport")(passport);

connectDB();

// Using EJS for views
app.set("view engine", "ejs");

// Using HTML for views
app.set("view engine", "html");

app.engine("html", ejs.renderFile);

// Static Folder, css, js files
app.use(express.static("public"));

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const rawJsonOptions = {
  type: "application/json",
};

// Logging
app.use(logger("dev"));

// Session Setup - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, ect...
app.use(flash());

app.get("/cart_styles.css", (req, res) => {
  res.type("text/css");
  res.sendFile("/path/to/cart_styles.css");
});

// Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
//index, login, logout,signup,webhook, products?
app.use("/checkout", checkoutRoutes);

app.get("/producttest", (req, res) => {
  res.json(products);
});

getProducts()
  .then((data) => {
    // Assign the retrieved products to the products array
    products.push(...data);
    // console.log('Products loaded:', products);
  })
  .catch((error) => {
    console.error('Error loading products:', error);
  });

app.listen(PORT, () => {
  console.log("App running on port " + PORT);
});
