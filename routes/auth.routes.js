const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const isAuth = require("../middlewares/isAuth")


router.post("/login", async (req, res, next)=>{

    const {username, password} = req.body

    // const tkn = async (pass)=>{

    //     const salt = await bcrypt.genSalt(10)
    //     const hashedPassword = await bcrypt.hash(pass, salt)
    //     console.log("hash", hashedPassword)
    // }

    // tkn("1234abcdABCD")

    if(!username || !password){
        res.status(400).json({errorMessage: "Rellena los campos"})
        return
    }

    try{

        const foundUser = await User.findOne({username})

        if(foundUser == null){
            res.status(400).json({errorMessage: "usuario incorrecto"})
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

        res.json({authToken: authToken})
    }
    catch(err){
        console.log(err)
    }

}) 

router.get("/verify", isAuth, async (req, res, next)=>{
    try{
        res.json(req.payload)
    }
    catch(error){
        next(error)
    }
})

module.exports = router