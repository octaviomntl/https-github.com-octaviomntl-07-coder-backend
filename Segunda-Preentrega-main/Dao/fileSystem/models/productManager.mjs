import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import __dirname from '../../config/path.js'

export class ProductManager {
    constructor() {
        this.path = join(__dirname, '../../Dao/fileSystem/products.json')
        this.archivoExiste()
    }

    esNumero(num) {
        if (!(String(num) === num)) {
            return true
        } else {
            return false
        }
    }

    validarPropiedades(objeto, propiedadesPermitidas = ['title', 'price', 'stock', 'description', 'thumbnail', 'code', "category", "status"]) {
        // Obtener las claves del objeto
        const clavesObjeto = Object.keys(objeto)
    
        // Verificar si todas las claves del objeto están en las propiedades permitidas
        const propiedadesNoPermitidas = clavesObjeto.filter(clave => !propiedadesPermitidas.includes(clave))
    
        // Si hay propiedades no permitidas, lanzar un error
        if (propiedadesNoPermitidas.length > 0) {
            throw new Error(`Propiedades no permitidas: ${propiedadesNoPermitidas.join(', ')}`)
        }
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

    // Método para obtener todos los productos.
    async getProducts() {
        try {
            // Obtiene y muestra por consola todos los productos.
            let products = await this.leerArchivo(this.path)
            return { success: true, message: "Productos obtenidos correctamente", data: products }
        }
        catch (error) {
            // Captura y manejo de errores durante la obtención de productos.
            return { success: false, message: `Error al obtener los productos.`, error: error.message }
        }
    }

    // Método para agregar un nuevo producto.
    async addProducts(newProduct) {
        try {
            this.validarPropiedades(newProduct)

            // Verifica si algún campo requerido está vacío.
            if (!(newProduct.title && newProduct.description && newProduct.price && newProduct.category && newProduct.code && newProduct.stock >= 0)) {
                throw new Error('El producto que intenta agregar no tiene todos los campos')
            }

            // Obtiene productos existentes.
            let products = await this.leerArchivo(this.path)

            // Verifica si el código del producto ya existe. Con 2 iguales ('=') a propósito por si tenemos un caso como 12345 == "12345", eso tiene que dar true ya que son el mismo código pero en forma de string y número
            if (products.some((prod) => prod.code == newProduct.code)) {
                throw new Error(`El código ${newProduct.code} ya existe`)
            }

            // Verifica si el stock es un número y no un string.
            if (!(this.esNumero(newProduct.stock)) || newProduct.stock < 0 || newProduct.stock !== parseInt(newProduct.stock)) {
                throw new Error(`El stock ${newProduct.stock} debe ser un número entero positivo o 0`)
            }

            // Verifica si el precio es positivo y no es string.
            if (!(this.esNumero(newProduct.price)) || newProduct.price < 0) {
                throw new Error(`El precio ${newProduct.price} debe ser un número positivo.`)
            }

            // Verifica si el título del producto ya existe.
            if (products.some((prod) => prod.title === newProduct.title)) {
                throw new Error(`El título ${newProduct.title} ya existe`)
            }

            // Genera un nuevo ID basado en el último producto existente.
            newProduct.id = products.length ? products[products.length - 1].id + 1 : 1

            //Si la imagen que se ingresa es un solo string, lo mete en un array vacío y si no se ingresa nada, inicia la propiedad con array vacío
            if (newProduct.thumbnail) {
                if (typeof newProduct.thumbnail === "string") {
                    newProduct.thumbnail = [newProduct.thumbnail]
                }
            } else {
                newProduct.thumbnail = []
            }

            //Se inicia la propiedad status en true por defecto a menos que el stock sea 0.
            if (newProduct.stock === 0) {
                newProduct.status = false
            } else {
                newProduct.status = true
            }

            // Agrega el nuevo producto y actualiza el archivo.
            products.push(newProduct)
            await this.escribirArchivo(this.path, products)

            // Devuelve un objeto que indica el éxito.
            return { success: true, message: `El producto ${newProduct.title} ha sido agregado correctamente`, data: newProduct }
        }
        catch (error) {
            // Captura y manejo de errores durante la adición de productos.
            return { success: false, message: `Error al agregar el producto`, error: error.message }
        }
    }

    // Método para obtener un producto por su ID.
    async getProductById(id) {
        try {
            // Obtiene productos y busca un producto por ID.
            let products = await this.leerArchivo(this.path)
            let busquedaPorId = products.find((prod) => prod.id === id)

            if (busquedaPorId) {
                return { success: true, message: `El producto con id ${id} se encontró exitosamente.`, data: busquedaPorId }
            } else {
                throw new Error(`El producto con id ${id} no ha sido encontrado.`)
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la obtención de un producto por ID.
            return { success: false, message: `Error al obtener el producto por ID.`, error: error.message }
        }
    }

    // Método para actualizar los campos de un producto por su ID.
    async updateProduct(id, camposActualizados) {
        try {
            this.validarPropiedades(camposActualizados)

            // Obtener la lista actual de productos.
            let products = await this.leerArchivo(this.path)

            //Uso findIndex para saber la posición del producto buscado, si devuelve -1 no existe
            let productoIndex = products.findIndex((prod) => prod.id === id)

            if (productoIndex !== -1) {

                //El código de producto no se pueden cambiar manualmente. Y el id no se puede ingresar como propiedad a cambiar gracias a la función validarPropiedades()
                delete camposActualizados.code

                //Obtenemos los productos ya existente a excepción del que queremos modificar para hacer algunas validaciones
                let reducidos = products.filter((prod) => prod.id !== id)

                // Verifica si el título del producto ya existe. Ya que no podemos modificar el producto con el título de otro libro ya existente.
                if (reducidos.some((prod) => prod.title === camposActualizados.title)) {
                    throw new Error(`El título ${camposActualizados.title} ya existe y no puede haber 2 libros con el mismo nombre.`)
                }

                // Verifica si el stock es un número y no un string.
                if (!(this.esNumero(camposActualizados.stock)) || camposActualizados.stock < 0 || camposActualizados.stock !== parseInt(camposActualizados.stock)) {
                    throw new Error(`El stock ${camposActualizados.stock} debe ser un número entero positivo o 0`)
                }

                // Verifica si el precio es positivo y no es string.
                if (!(this.esNumero(camposActualizados.price)) || camposActualizados.price < 0) {
                    throw new Error(`El precio ${camposActualizados.price} debe ser un número positivo.`)
                }

                // Copiar el producto encontrado para realizar modificaciones.
                let productoAModificar = { ...products[productoIndex] }

                //Si la imagen que se ingresa es un solo string, lo mete en el array ya existente y si se ingresa un array nuevo, se reemplaza
                if (camposActualizados.thumbnail) {
                    if (typeof camposActualizados.thumbnail === "string") {
                        camposActualizados.thumbnail = productoAModificar.thumbnail.push(camposActualizados.thumbnail)
                        delete camposActualizados.thumbnail
                    }
                }

                // Actualizar los campos del producto con los proporcionados.
                Object.assign(productoAModificar, camposActualizados)

                //Se actualiza la propiedad status segun el stock disponible.
                if (productoAModificar.stock === 0) {
                    productoAModificar.status = false
                } else {
                    productoAModificar.status = true
                }

                // Reemplazar el producto original con el modificado en la lista de products.
                products[productoIndex] = productoAModificar

                // Escribir la lista actualizada de products en el archivo.
                await this.escribirArchivo(this.path, products)

                return { success: true, message: `El producto con id ${id} ha sido actualizado.`, data: productoAModificar }
            } else {
                throw new Error(`El producto con id: ${id} no ha sido encontrado`)
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la actualización del producto.
            return { success: false, message: "Error al actualizar el producto.", error: error.message }
        }
    }

    // Método para eliminar un producto por su ID.
    async deleteProduct(id) {
        try {
            // Obtener la lista actual de productos.
            let productos = await this.leerArchivo(this.path)

            // Buscar el producto a eliminar y guardar la respuesta del método
            const respuesta = await this.getProductById(id)

            if (respuesta.success) {
                // Filtrar los productos para excluir el que tiene el ID proporcionado.
                let productosReducido = productos.filter((prod) => prod.id !== id)

                // Escribir la lista actualizada de productos en el archivo.
                await this.escribirArchivo(this.path, productosReducido)
                return { success: true, message: `El producto con id ${id} ha sido eliminado correctamente de la base de datos.`, data: productosReducido }
            } else {
                throw new Error(`El producto con id ${id} no se eliminó ya que no se encuentra en la base de datos.`)
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la eliminación del producto.
            return { success: false, message: `Error al eliminar el producto.`, error: error.message }
        }
    }
}

// Exportación de la clase ProductManager para su uso en otros módulos.
export default { ProductManager }
