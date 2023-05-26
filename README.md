# Ecommerce-Project

# Introduction

An Ecommerce template built using the MVC Architecture, we have also implemented "authorization"

# Objectives

- It's a beginner/mid level app to be able to use for your next client website

---

# Who is this for? 

- It's for beginners & intermediates with little more experience


# Packages/Dependencies used 

bcrypt, connect-mongo, dotenv, ejs, express, express-flash, express-session, mongodb, mongoose, morgan, nodemon, passport, passport-local, validator, stripe

---

# Install all the dependencies or node packages used for development via Terminal

`npm install` 

---

# Things to add

- Create a `.env` file and add the following as `key: value` 
  - PORT: 2121 (can be any port example: 3000) 
  - DB_STRING: `your database URI` 
# ejs-stripe-checkout
Example EJS app on how to integrate with Stripe API.

## Instructions
Before running the app, you will have to add some products to your Stripe account if you haven't already. When the app starts, it will load the products that are on your Stripe account.

1. `npm install` to install dependencies.
2. Create `.env` file and add `STRIPE_API_KEY` and `STRIPE_WEBHOOK_ENDPOINT_KEY` (you can find the webhook endpoint key in the code at the URL https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local).
3. Install the Stripe CLI and run `stripe listen --forward-to localhost:8000/webhook`.
4. `npm run start`.
5. App is now running at `localhost:8000`.
