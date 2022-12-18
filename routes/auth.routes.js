const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


router.post("/login", async (req, res, next)=>{

    const {username, password} = req.body
    if(!username || !password){
        res.status(400).json({errorMessage: "Deben rellenarse todos los campos"})
        return
    }

    try{

        const foundUser = await User.findOne({username})

        if(foundUser == null){
            res.status(400).json({errorMessage: "El usuario no es correcto"})
            return
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        if(!isPasswordValid){
            res.status(400).json({errorMessage: "contraseña incorrecta"})
            return
        }

        const payload = {
            _id: foundUser._id,
            username: foundUser.username
        }

        const authToken = jwt.sign(payload, process.env.SECRET, {algorithm: "HS256", expiresIn: "1h"})

        res.json({authToken})
    }
    catch(err){
        console.log(err)
    }

}) 

module.exports = router