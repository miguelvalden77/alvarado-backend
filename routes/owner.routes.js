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

router.post("/transactions/client", async (req, res, next) => {

    const { client } = req.body

    if (!client) {
        res.status(400).json({ errorMessage: "No hay nombre de ningún cliente" })
        return
    }

    try {

        const transactions = await Transaction.find({ "customer.nombre": { $regex: `.*${client}.*`, $options: "i" } })
        res.json({ transactions, total: transactions.length })

    } catch (err) {
        next(err)
    }
})

router.get("/salesByMonth/:date", isAuth, async (req, res, next) => {

    const { date } = req.params
    const [year, month] = date.split("-")
    const jsDate = new Date(`${year}-${month}-01`)
    const jsDateLimit = new Date(`${Number(month) == 12 ? Number(year) + 1 : year}-${Number(month) == 12 ? 1 : Number(month) + 1}-01`)
    const isoDate = jsDate.toISOString()
    const isoDateLimit = jsDateLimit.toISOString()

    try {

        const transacciones = await Transaction.find({ createdAt: { $gte: isoDate, $lt: isoDateLimit } }).select(["amount", "createdAt"])
        console.log(transacciones)
        if (!transacciones) {
            res.json({ message: "No hay resultados para esa búsqueda" })
            return
        }

        res.json(transacciones)
    }
    catch (err) {
        next(err)
    }

})

module.exports = router