import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import __dirname from '../../config/path.js'

export class CartsManager {
    constructor() {
        this.path = join(__dirname, '../../Dao/fileSystem/carts.json')
        this.path2 = join(__dirname, '../../Dao/fileSystem/products.json')
        this.archivoExiste()
    }

    //Método para verificar si el archivo existe. si no, lo crea con un array vacío.
    async archivoExiste() {
        try {
            // Verifica si el archivo existe.
            const existe = existsSync(this.path)
            if (!existe) {
                // Si el archivo no existe, lo crea con un array vacío.
                await fs.writeFile(this.path, '[]', 'utf-8')
                console.log(`Archivo creado exitosamente en la ruta ${this.path}`)
            }
        } catch (error) {
            // Captura y manejo de errores durante la creación del archivo.
            console.error(`Hubo un error al crear el archivo ${this.path}. El error fue ${error}`)
        }
    }

    // Método para leer el contenido de un archivo JSON.
    async leerArchivo(ruta) {
        try {
            // Lee y parsea el contenido del archivo JSON.
            return JSON.parse(await fs.readFile(ruta, 'utf-8'))
        } catch (error) {
            // Captura y manejo de errores durante la lectura del archivo.
            console.error(`Error al leer el archivo.`, error)
        }
    }

    // Método para escribir en un archivo JSON.
    async escribirArchivo(ruta, contenido) {
        try {
            // Escribe el contenido en el archivo JSON.
            await fs.writeFile(ruta, JSON.stringify(contenido), 'utf-8')
        } catch (error) {
            // Captura y manejo de errores durante la escritura en el archivo.
            console.error(`Error al escribir en el archivo.`, error)
        }

    }

    // Método para añadir un carrito nuevo al archivo de persistencia.
    async addCart() {
        try {
            // Obtiene los carritos existentes.
            let carrito = await this.leerArchivo(this.path)

            // Genera un nuevo ID basado en el último carrito existente.
            let idCarrito = carrito.length ? carrito[carrito.length - 1].id + 1 : 1

            // Agrega el nuevo producto y actualiza el archivo.
            let newCart = { "id": idCarrito, "products": [] }
            carrito.push(newCart)
            await this.escribirArchivo(this.path, carrito)

            // Devuelve un objeto que indica el éxito.
            return { success: true, message: `El carrito ${newCart.id} ha sido agregado correctamente`, data: newCart }
        }
        catch (error) {
            // Captura y manejo de errores durante la adición de carritos.
            return { success: false, message: `Error al agregar el carrito`, error: error.message }
        }
    }

    // Método para obtener un carrito.
    async getCart(id) {
        try {
            // Obtiene todos los carritos del archivo de persistencia.
            let carts = await this.leerArchivo(this.path)

            //Buscamos el carrito con el id proporcionado
            let carritoEncontrado = carts.find(cart => cart.id === id)

            if (!carritoEncontrado) {
                throw new Error(`El carrito con id ${id} no existe en la base de datos.`);
            }

            if (carritoEncontrado.products.length === 0) {
                return { success: true, message: "El carrito está vacío.", data: carritoEncontrado.products }
            }

            //Leemos el archivo con los productos para luego buscar cada producto con find
            let products = await this.leerArchivo(this.path2)
            let respuesta = carritoEncontrado.products.map(prod => {
                let objeto = products.find(producto => producto.id === prod.id)

                return objeto ? {
                    "title": objeto.title,
                    "description": objeto.description,
                    "price": objeto.price,
                    "priceTotal": objeto.price * prod.quantity,
                    "quantity": prod.quantity,
                    "id": objeto.id
                } : { "error": "Producto no encontrado" }
            })
            return { success: true, message: "Productos obtenidos correctamente", data: respuesta }
        } catch (error) {
            // Captura y manejo de errores durante la obtención de carritos.
            return { success: false, message: `Error al obtener los productos.`, error: error.message }
        }
    }

    // Método para añadir un producto al carrito según el id del carrito y del producto.
    async addProductsToCart(cid, pid) {
        try {
            //Leemos el archivo con los productos para luego buscar cada producto con find. Verificamos el stock de dicho producto
            let products = await this.leerArchivo(this.path2)
            let prodIndexVerificaStock = products.findIndex(prod => prod.id === pid)

            //Verificar si hay stock del producto
            if (prodIndexVerificaStock === -1 || products[prodIndexVerificaStock].stock === 0) {
                throw new Error(`No se puede agregar el producto con id ${pid} ya que no hay mas stock.`)
            }

            //Reducir el stock, ya que si o si se va a disminuir y actualizar stock asi no hay problemas de asincronismo. 
            products[prodIndexVerificaStock].stock--
            await this.escribirArchivo(this.path2, products)

            // Obtiene todos los carritos del archivo de persistencia. Buscamos la posición del carrito coincidente con cid y hacemos copia del mismo
            let carts = await this.leerArchivo(this.path)
            let cartIndex = carts.findIndex((cart) => cart.id === cid)
            let carritoAModificar = { ...carts[cartIndex] }

            //Buscamos el producto con el pid proporcionado, en este caso no necesariamente existe.
            let productoEncontradoIndex = carritoAModificar.products.findIndex(prod => prod.id === pid)

            if (productoEncontradoIndex !== -1) {
                carritoAModificar.products[productoEncontradoIndex].quantity++
            } else {
                carritoAModificar.products.push({ "id": pid, "quantity": 1 })
            }

            // Reemplazar el carrito original con el modificado en la lista de carritos.
            carts[cartIndex] = carritoAModificar

            // Escribir la lista actualizada de carritos en el archivo.
            await this.escribirArchivo(this.path, carts)

            return {
                success: true,
                message: `El producto con id ${pid} ${productoEncontradoIndex !== -1 ? 'ya existía y se aumentó la cantidad' : 'se agregó correctamente'}.`,
                data: carritoAModificar.products
            }
        } catch (error) {
            // Captura y manejo de errores durante la obtención de un carrito por ID.
            return { success: false, message: `Error al obtener el producto por ID.`, error: error.message }
        }
    }
}

// Exportación de la clase CartsManager para su uso en otros módulos.
export default { CartsManager }
