import { Router } from "express"
import { ProductManager } from "../../Dao/db/models/productManagerDB.js"

const prod = new ProductManager()

//Instanciamos Router() en la variable que vamos a usar routerHandlebars
const routerProducts = Router()

routerProducts.get('/', async (req, res) => {
    //const products = await prod.getProducts(1000, 1, 1)
    const products = await prod.getProducts()

    res.render('products', {
        "array": products.payload,
        "valor": true
    })
})

export default routerProducts
