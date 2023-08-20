const isAuth = require("../middlewares/isAuth")
const Transaction = require("../models/Transaction.model")

const router = require("express").Router()


router.post("/allTransactions", isAuth, async (req, res, next) => {

    const { state, page, ventas } = req.body
    const pagina = page * ventas
    console.log({ state })

    try {
        if (!state || state == "Todos") {
            const total = await Transaction.count()
            const transactions = await Transaction.find({ status: "succeeded" }).sort({ createdAt: -1 }).skip(pagina - ventas).limit(ventas)
            res.json({ transactions, total })
            return
        }

        const transactions = await Transaction.find({ status: "succeeded", state: state }).sort({ createdAt: -1 }).skip(pagina - ventas).limit(ventas)
        const total = await Transaction.find({ status: "succeeded", state: state }).count()
        console.log({ transactions, total })
        res.json({ transactions, total })
        return
    }
    catch (err) {
        console.log(err)
    }

})

module.exports = router