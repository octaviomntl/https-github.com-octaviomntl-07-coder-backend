import { Router } from "express"
import { CartsManager } from "../../Dao/db/models/cartManagerDB.js"

const routerCart = Router()
const carts = new CartsManager()

routerCart.post('/', async (req, res) => {
    let cart = await carts.addCart()
    if (cart.success) {
        res.status(201).json({ message: cart.message, data: cart.data })
    } else {
        res.status(500).json({ message: cart.message, error: cart.error })
    }
})

routerCart.get('/:cid', async (req, res) => {
    let id = req.params.cid
    let carrito = await carts.getCart(id)

    if (carrito.success) {
        res.render('cart', {
            "array": carrito.data,
            "valor": true
        })
    } else {
        res.status(404).json({ message: carrito.message, error: carrito.error })
    }
})

routerCart.post('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid

    let addToCart = await carts.addProductsToCart(cid, pid)

    if (addToCart.success) {
        res.status(201).json({ message: addToCart.message, data: addToCart.data })
    } else {
        res.status(404).json({ message: addToCart.message, error: addToCart.error })
    }
})

routerCart.put('/:cid', async (req, res) => {
    let cid = req.params.cid
    let data = req.body.products

    let updateCart = await carts.updateCart(cid, data)

    if (updateCart.success) {
        res.status(201).json({ message: updateCart.message, data: updateCart.data })
    } else {
        res.status(404).json({ message: updateCart.message, error: updateCart.error })
    }
})

routerCart.put('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let quantity = req.body.quantity

    let updateQuantity = await carts.updateQuantity(cid, pid, quantity)

    if (updateQuantity.success) {
        res.status(201).json({ message: updateQuantity.message, data: updateQuantity.data })
    } else {
        res.status(404).json({ message: updateQuantity.message, error: updateQuantity.error })
    }
})

routerCart.delete('/:cid/products/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid

    let deleteToCart = await carts.deleteProductToCart(cid, pid)

    if (deleteToCart.success) {
        res.status(200).json({ message: deleteToCart.message, data: deleteToCart.data })
    } else {
        res.status(404).json({ message: deleteToCart.message, error: deleteToCart.error })
    }
})

export default routerCart