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
        }
    }
)

const Transaction = model("Transaction", transactionSchema)

module.exports = Transaction