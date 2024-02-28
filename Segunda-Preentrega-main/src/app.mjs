import express, { urlencoded } from 'express'
import { engine } from 'express-handlebars'
import __dirname from '../config/path.js'
import { join } from 'node:path'
import { conectarConMongoDB } from "../Dao/db/index.js"

import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'
import routerProducts from './routes/handlebars.routes.js'
import { routerRealTimeProducts, server, app } from './routes/realTimeProds.routes.js'
import { routerChat } from './routes/chat.routes.js' 

// Configurar Express 
app.use(express.json())
app.use(urlencoded({ extended: true }))

//Configurar Handlebars o motor de plantilla
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, '../src/views'))

//Configurar archivos estaticos de la carpeta public
app.use('/', express.static(join(__dirname, '../src/public')))

//Routes o endpoints
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)
app.use('/products', routerProducts)
app.use('/realtimeproducts', routerRealTimeProducts)
app.use('/api/chat', routerChat)

// Iniciar el servidor en el puerto 8080
server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:8080`)
    conectarConMongoDB()
})
