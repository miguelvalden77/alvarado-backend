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
        },
        customer: {
            type: Object,
            required: true,
            nombre: {
                type: String,
                required: true
            },
            apellido: {
                type: String,
                required: true
            },
            direccion: {
                type: String,
                required: true
            },
            codigo: {
                type: Number,
                required: true
            },
            correo: {
                type: String,
                required: true
            },
            numero: {
                type: Number,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
)

const Transaction = model("Transaction", transactionSchema)

module.exports = Transaction