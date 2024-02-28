import { Chat } from "./chat.modelDB.js"

export class ChatManager {

    // Método para añadir un mensaje nuevo a la db.
    async addChat(id) {
        try {
            let chat = await Chat.create({id: id})
            return { success: true, message: `Chat agregado correctamente`, data: chat }
        }
        catch (error) {
            // Captura y manejo de errores durante la adición de carritos.
            return { success: false, message: `Error al agregar el chat`, error: error.message }
        }
    }

    // Método para obtener los mensajes.
    async getChat(id) {
        try {
            let chat = await Chat.findOne({id: id}).populate("messages.message")
            return { success: true, message: `Chat obtenido correctamente`, data: chat }
            
        } catch (error) {
            // Captura y manejo de errores durante la adición de carritos.
            return { success: false, message: `Error al obtener el chat`, error: error.message }
        }

    }

    // Método para añadir un producto al carrito según el id del carrito y del producto.
    async addMessageToChat(cid, mensaje) {
        try {
            let resultado = await Chat.updateOne({ id: cid }, { $push: { messages: { user: mensaje.name, message: mensaje.message } } })
            //let resultado = await Chat.findOne({ id: cid })
            //console.log(resultado)
            return { success: true, message: `El mensaje se agregó correctamente al chat.`, data: resultado }

        } catch (error) {
            // Captura y manejo de errores durante la obtención de un carrito por ID.
            return { success: false, message: `Error al agregar el mensaje al chat.`, error: error }
        }
    }
}

// Exportación de la clase ChatManager para su uso en otros módulos.
export default { ChatManager }
