import mongoose from "mongoose"
import mongoosePaginate  from 'mongoose-paginate-v2'

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String, 
        unique: true,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    code: {
        type: String, 
        unique: true,
        required: true
    },
    category: {
        type: String, 
        required: true,
        enum: ["OMA-Nivel-1", "OMA-Nivel-2", "OMA-Nivel-3", "OMA-Nivel-4", "OMA-Nivel-5", "OMA-Nivel-6"]
    },
    thumbnail: {
        type: [String],
        default: []     
    },
    stock: {
        type: Number, 
        default: 10
    },
    status: {
        type: Boolean,
        default: true
    }
})

ProductsSchema.plugin(mongoosePaginate)

export const Product = mongoose.model('products', ProductsSchema)