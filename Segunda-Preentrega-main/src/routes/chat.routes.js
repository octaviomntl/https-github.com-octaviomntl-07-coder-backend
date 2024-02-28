import { Router } from "express"
import { io } from "../routes/realTimeProds.routes.js"
import { ChatManager } from "../../Dao/db/models/chatManagerDB.js"

//Instanciamos la clase de chatManager
const chatManager = new ChatManager()

//Instanciamos Router() en la variable que vamos a usar routerChat
const routerChat = Router()

//get de realtimechat y servidor io que escuchaq constantemente
routerChat.get('/', async (req, res) => {
    res.render('realTimeChat')
})

io.on('connection', async (socket) => {
    let messages = JSON.parse(JSON.stringify((await chatManager.getChat(1)).data.messages))
    io.sockets.emit('respuestaMessage', messages)

    socket.on('userMessage', async (data) => {
        await chatManager.addMessageToChat(1, data)

        let messages = JSON.parse(JSON.stringify((await chatManager.getChat(1)).data.messages))
        io.sockets.emit('respuestaMessage', messages)
    })
})

export { routerChat }