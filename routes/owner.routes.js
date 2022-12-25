const Transaction = require("../models/Transaction.model")

const router = require("express").Router()


router.get("/allTransactions", async (req, res, next)=>{

    try{
        console.log("Hola")
        const transactions = await Transaction.find({status: "succeeded"})
        res.json(transactions)
    }
    catch(err){
        console.log(err)
    }

})

module.exports = router