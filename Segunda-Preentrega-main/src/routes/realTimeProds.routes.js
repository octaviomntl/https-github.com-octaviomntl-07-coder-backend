import express, { Router } from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { ProductManager } from "../../Dao/db/models/productManagerDB.js" 

const app = express()
const server = createServer(app)

//Crear un servidor a traves de socket, con nuestro servidor http
const io = new Server(server)

//Instanciamos Router() en la variable que vamos a usar routerProd
const routerRealTimeProducts = Router()

// Crear una instancia de Produ ctManager
const prod = new ProductManager()

//get de realtimeproducts y servidor io que escuchaq constantemente
routerRealTimeProducts.get('/', async (req, res) => {
    const products = await prod.getProducts()
    res.render('realTimeProducts', {
        "array": products.data,
        "valor": true
    })
})

//Prendo el servidor io y me pongo a escuchar con .on 
io.on('connection', async (socket) => {

    // Emitir los productos iniciales al conectarse
    const products = await prod.getProducts()
    socket.emit('productsListos', products.data)

    //Mensaje de conexion apenas cargamos el sitio.
    socket.on('mensajeConexion', (data) => {
        if (data) {
            console.log(data)
            socket.emit('mensaje', 'Hola cliente')
        }
    })

    //Recibo todos los productos del Front actualizados, los proceso y los guardo en un array, pero solo con la propiedades necesarias
    socket.on('dataProducts', (data) => {
        const arrayProductosListo = []
        for (let obj of data) {
            arrayProductosListo.push({
                "title": obj.title,
                "description": obj.description,
                "price": obj.price,
                "category": obj.category
            })
        }

        //Mandamos el objeto con los productos listos para crear una funcion que genere html por cada producto y los haga cards
        io.sockets.emit('productsListos', arrayProductosListo)
    })
})

export { app, io, server, routerRealTimeProducts }