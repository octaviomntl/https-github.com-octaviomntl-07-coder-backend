import { Router } from "express"
import { soloNumero, unoMenosUno } from "../functionTest/functions.mjs"
import { io } from "../routes/realTimeProds.routes.js"

// Importar la clase ProductManager desde el módulo index.js
import { ProductManager } from "../../Dao/db/models/productManagerDB.js"

// //Importar la clase ProductManager desde el módulo index.js
// import { ProductManager2 } from "../../Dao/db/models/productManager5000.js"
// const products2 = new ProductManager2()

//Instanciamos Router() en la variable que vamos a usar routerProd
const routerProd = Router()

// Crear una instancia de ProductManager
const products = new ProductManager()


routerProd.get('/', async (req, res) => {
    let limit = soloNumero(req.query.limit) || 10
    let page = soloNumero(req.query.page) || 1
    let sort = unoMenosUno(req.query.sort) || null
    let query = req.query.query

    // Obtener productos con el método getProducts()
    let productos = await products.getProducts(limit, page, sort, query)

    productos.payload = productos.payload.map(item => {
        return {
            id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category.replace(/-/g, ' '),
            stock: item.stock,
            disponibilidad: item.status,
            thumbnail: item.thumbnail
        }
    })

    if (productos.success && productos.payload.length > 0) {
        res.render('products', {
            "array": productos.payload,
            "valor": true
        })
        //res.status(200).json({ productos })

    } else if (productos.payload.length == 0) {
        res.status(500).json({ message: "No hay productos para mostrar", data: productos.payload, totalPages: productos.totalPages })
    } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(500).json({ message: productos.message, error: productos.error })
    }
})

routerProd.get('/:pid', async (req, res) => {
    //Capturar id de params y buscar producto con método getProductById()
    let pid = req.params.pid
    let productoId = await products.getProductById(pid)

    if (productoId.success) {
        res.status(200).json({ message: productoId.message, data: productoId.data })
    } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(404).json({ message: productoId.message, error: productoId.error.message })
    }
})

routerProd.post('/', async (req, res) => {
    let solicitud = req.body
    // Agregar productos usando el método addProducts()
    let producto = await products.addProducts(solicitud)

    // //Para agregar varios productos al mismo tiempo
    //await products2.addProducts()

    if (producto.success) {

        //Con estas 2 lineas de codigo emitimos un mensaje que avisa que se tienen que cargar nuevos productos en la pagina en tiempo real
        let productosHandlebars = (await products.getProducts()).data
        io.sockets.emit('actualizarProductos', productosHandlebars)

        res.status(201).json({ message: producto.message, data: producto.data })
    } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(400).json({ message: producto.message, error: producto.error })
    }
})

routerProd.put('/:pid', async (req, res) => {
    let id = req.params.pid

    // Actualizar productos usando el método updateProduct()
    let producto = await products.updateProduct(id, req.body)

    if (producto.success) {
        //Con estas 2 lineas de codigo emitimos un mensaje que avisa que se tienen que cargar nuevos productos en la pagina en tiempo real
        let productosHandlebars = (await products.getProducts()).data
        io.emit('actualizarProductos', productosHandlebars)

        res.status(201).json({ message: producto.message, data: producto.data })
    } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(404).json({ message: producto.message, error: producto.error.message })
    }
})

routerProd.delete('/:pid', async (req, res) => {
    let id = req.params.pid

    // Eliminar productos usando el metodo deleteProduct()
    let respuesta = await products.deleteProduct(id)

    if (respuesta.success) {
        //Con estas 2 lineas de codigo emitimos un mensaje que avisa que se tienen que cargar nuevos productos en la pagina en tiempo real
        let productosHandlebars = (await products.getProducts()).data
        io.emit('actualizarProductos', productosHandlebars)

        res.status(200).json({ message: respuesta.message })
    } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(404).json({ message: respuesta.message, error: respuesta.error.message })
    }
})

export default routerProd
