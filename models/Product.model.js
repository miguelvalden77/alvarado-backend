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
        allergens: {
            type: String,
            enum: ["Pescado", "Frutos secos", "Leche", "Huevos", "Cacahuetes", "Soja", "Gluten", "Apio", "Sésamo"]
        }
    },
    {
        timestamps: true
    }
)

const Product = model("Product", productSchema)

module.exports = Product