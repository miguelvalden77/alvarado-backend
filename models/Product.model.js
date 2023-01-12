const {Schema, model } = require("mongoose")

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        },
        stock: {
            type: Boolean,
            required: true,
            default: true
        },
        category: {
            type: String,
            enum: ["jamones-paletas", "quesos", "envasados", "embutidos", "vinos", "carnes", "bacalaos", "lotes"],
            required: true
        },
        image: {
            type: String,
            required: true
        },
        peso: {
            type: Number,
            required: true
        },
        isCorte: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Product = model("Product", productSchema)

module.exports = Product