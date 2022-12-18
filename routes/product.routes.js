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

    }
    catch(err){
        console.log(err)
    }

})

module.exports = router