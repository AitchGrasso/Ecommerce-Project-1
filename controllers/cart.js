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