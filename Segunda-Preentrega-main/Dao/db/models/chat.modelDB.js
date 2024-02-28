import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    messages: {
        type: [
            {
                user: {
                    type: String,
                    required: true
                },
                message: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    }
})

export const Chat = mongoose.model('chats', ChatSchema)