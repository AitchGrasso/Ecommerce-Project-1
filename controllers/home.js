const { products, getProducts } = require('../models/Products');
const { getNumUserItems } = require('../models/Cart');

module.exports = {
    getIndex: (req,res)=>{
        res.render("index.ejs", { products, numCartItems: getNumUserItems() })
    },
    getProducts: (req,res)=>{
        res.render("products.ejs", { products, numCartItems: getNumUserItems() })
    }
}