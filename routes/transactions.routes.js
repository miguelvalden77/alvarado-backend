const Transaction = require("../models/Transaction.model")
const router = require("express").Router()


router.post("/create", async (req, res, next)=>{

    const {id, client_secret, status} = req.body

    try{
        const transaction = await Transaction.findOneAndUpdate({payment_intent: id, client_secret: client_secret}, {status: status})
        console.log(transaction, "Transactioooon")
    }
    catch(err){
        console.log(err)
    }

})

router.post("/changeState/:state", async (req, res, next)=>{

    const {state} = req.params
    const {id} = req.body

    if(!state || !id){
        res.status(400).json({errorMessage: "Faltan datos"})
    }

    try{

        await Transaction.findByIdAndUpdate(id, {state: state})
        res.json({succesMessage: "Estado cambiado"})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router