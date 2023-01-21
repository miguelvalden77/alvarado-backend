const isAuth = require("../middlewares/isAuth")
const Transaction = require("../models/Transaction.model")

const router = require("express").Router()


router.post("/allTransactions", isAuth, async (req, res, next)=>{

    const {state, page} = req.body
    const pagina = page * 10
    
    try{
        if(!state){
            const transactions = await Transaction.find({status: "succeeded"}).sort({createdAt: -1}).skip(pagina - 10).limit(pagina)
            const total = await Transaction.count()
            res.json({transactions, total})
            return
        }

        const transactions = await Transaction.find({status: "succeeded", state: state}).sort({createdAt: -1}).skip(pagina - 10).limit(pagina)
        res.json(transactions)
        return
    }
    catch(err){
        console.log(err)
    }

})

module.exports = router