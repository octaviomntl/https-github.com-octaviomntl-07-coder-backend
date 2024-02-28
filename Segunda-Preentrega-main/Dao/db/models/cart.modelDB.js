import mongoose from "mongoose"

const CartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
})

export const Cart = mongoose.model('carts', CartsSchema)