import mongoose from "mongoose"

export async function conectarConMongoDB(){
    try {
        await mongoose.connect('mongodb+srv://mauriciofioretti:mauri1234@proyectocoderback.ooz4yfn.mongodb.net/eccomerce')
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

