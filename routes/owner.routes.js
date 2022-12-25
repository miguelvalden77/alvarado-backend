const Transaction = require("../models/Transaction.model")

const router = require("express").Router()


router.post("/allTransactions", async (req, res, next)=>{

    const {state} = req.body

    try{
        if(!state){
            const transactions = await Transaction.find({status: "succeeded"})
            res.json(transactions)
            return
        }

        const transactions = await Transaction.find({status: "succeeded", state: state})
        res.json(transactions)
        return
    }
    catch(err){
        console.log(err)
    }

})

module.exports = router