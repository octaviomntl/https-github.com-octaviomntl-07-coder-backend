import { Product } from './product.modelDB.js'

export class ProductManager {
    // Método para obtener todos los productos.
    async getProducts(limit=10, page=1, sort=null, query) {
        try {
            let productos;

            if (query == "disponibles") {
                productos = await Product.paginate( { status: true }, { limit, page, sort: sort ? { price: sort } : {} })
            } else {
                productos = await Product.paginate( query ? { category: query } : {}, { limit, page, sort: sort ? { price: sort } : {} })
            }

            productos.docs = productos.docs.map(doc => doc.toObject())

            return {
                success: true,
                message: "Productos obtenidos correctamente",
                payload: productos.docs,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.prevPage ? `http://localhost:8080/api/products?page=${productos.prevPage}&limit=${limit}&query=${query ? `&query=${query}` : ''}&sort=${sort}` : null,
                nextLink: productos.nextPage ? `http://localhost:8080/api/products?page=${productos.nextPage}&limit=${limit}&query=${query ? `&query=${query}` : ''}&sort=${sort}` : null
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la obtención de productos.
            return { success: false, message: `Error al obtener los productos.`, error: error }
        }
    }

    // Método para agregar un nuevo producto.
    async addProducts(newProduct) {
        try {
            await Product.create(newProduct)
            return { success: true, message: `El producto ${newProduct.title} ha sido agregado correctamente`, data: newProduct }
        }
        catch (error) {
            // Captura y manejo de errores durante la adición de productos.
            return { success: false, message: `Error al agregar el producto`, error: error }
        }
    }

    // Método para obtener un producto por su ID.
    async getProductById(id) {
        try {
            let busquedaPorId = await Product.findById(id)

            if (busquedaPorId) {
                return { success: true, message: `El producto con id ${id} se encontró exitosamente.`, data: busquedaPorId }
            } else {
                throw new Error(`El producto con id ${id} no ha sido encontrado.`)
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la obtención de un producto por ID.
            return { success: false, message: `Error al obtener el producto por ID.`, error: error }
        }
    }

    // Método para actualizar los campos de un producto por su ID.
    async updateProduct(id, camposActualizados) {
        try {
            let resultado = await Product.updateOne({ "_id": id }, camposActualizados)

            if (resultado.matchedCount === 0) {
                throw new Error(`El producto con id ${id} no ha sido encontrado.`)
            } else {
                let busquedaPorId = await Product.findById(id)
                return { success: true, message: `El producto con id ${id} ha sido actualizado.`, data: busquedaPorId }
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la actualización del producto.
            return { success: false, message: "Error al actualizar el producto.", error: error }
        }
    }

    // Método para eliminar un producto por su ID.
    async deleteProduct(id) {
        try {
            let resultado = await Product.deleteOne({ "_id": id })

            if (resultado.deletedCount === 0) {
                throw new Error(`El producto con id ${id} no ha sido encontrado.`)
            } else {
                return { success: true, message: `El producto con id ${id} ha sido eliminado correctamente de la base de datos.` }
            }
        }
        catch (error) {
            // Captura y manejo de errores durante la eliminación del producto.
            return { success: false, message: `Error al eliminar el producto.`, error: error }
        }
    }
}

// Exportación de la clase ProductManager para su uso en otros módulos.
export default { ProductManager }
