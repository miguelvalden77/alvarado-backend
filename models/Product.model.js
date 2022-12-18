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
            enum: ["jam&pa", "que", "vac", "emb", "vin", "car", "bac", "lot"],
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Product = model("Product", productSchema)

module.exports = Product