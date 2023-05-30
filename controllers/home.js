module.exports = {
    getIndex: (req,res)=>{
        res.render('index.ejs')
    }
}
// , { products, numCartItems: getNumUserItems()