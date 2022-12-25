const {model, Schema} = require("mongoose")

const transactionSchema = new Schema(
    {
        client_secret:{
            type: String,
            required: true
        },
        payment_intent:{
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        products: {
            type: [Object],
            required: true
        },
        state: {
            type: String,
            required: true,
            enum: ["Pendiente", "Realizado", "Enviado"],
            default: "Pendiente"
        }
    }
)

const Transaction = model("Transaction", transactionSchema)

module.exports = Transaction