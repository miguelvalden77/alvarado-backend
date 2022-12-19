const router = require("express").Router()
const { findByIdAndUpdate } = require("../models/Product.model")
const Product = require("../models/Product.model")


router.post("/create", async (req, res, next)=>{

    const {name, price, description, category, image} = req.body

    if(!name || !price || !description || !category || !image){
        res.status(400).json({errorMessage: "Debes rellenar todos los campos"})
        return
    }

    try{

        await Product.create({name, price, description, category, image})
        
        res.json({succesMessage: "Producto creado"})
    }
    catch(err){
        console.log(err)
    }

})

router.get("/:id/oneProduct", async (req, res, next)=>{
    const {id} = req.params

    try{
        const product = await Product.findById(id)
        res.json(product)
    }
    catch(err){
        console.log(err)
    }

})

router.get("/:category", async (req, res, next)=>{

    const {category} = req.params

    try{
        const products = await Product.find({category})

        res.json(products)
    }
    catch(err){
        console.log(err)
    }

})

router.get("/:id/stock", async (req, res, next)=>{

    const {id} = req.params

    try{
        const product = await Product.findById(id)

        if(product.stock == true){
            await Product.findByIdAndUpdate(id, {stock: false})
            res.json({succesMessage: "Stock changed"})
            return
        }

        await Product.findByIdAndUpdate(id, {stock: true})
        res.json({succesMessage: "Stock changed"})
    }
    catch(err){
        console.log(err)
    }

})

router.post("/:id/update", async (req, res, next)=>{

    const {id} = req.params
    const {name, description, price, image} = req.body

    if(!name || !description || !price || !image){
        res.json({errorMessage: "Deben rellenarse todos los campos"})
        return
    }

    try{
        await Product.findByIdAndUpdate(id, {name, description, price, image})

        res.json({succesMessage: "Producto actualizado"})
    }
    catch(err){
        console.log(err)
    }

})

router.delete("/:id/delete", async (req, res, next)=>{

    const {id} = req.params

    try{
        await Product.findByIdAndDelete(id)
        res.json({succesMessage: "Producto borrado"})
    }
    catch(err){
        console.log(err)
    }

})

const stripe = require("stripe")('sk_test_51MGUQ8GKc0rrkaCnXzab3LpEQNagPoHznPIXG1KpKVAUzfzRzRzNJmMDAm0fLwVzG7Tw0gc6rTiD16VCaOFPHmI900tSSmqEbZ')

const calculateOrderAmount = async (items)=>{
    
    const product = await Product.findById(items[0].id)

    return product.price
}

router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    
    const productToBuy = await Product.findById(items[0]._id)

  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: productToBuy.price * 100,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
});

module.exports = router