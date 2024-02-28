import { ProductManager } from "../models/productManager.mjs"

// Función autoinvocada asincrónica para ejecutar pruebas y operaciones con la clase ProductManager.
(async function ejecutar() {

    // Instancia de la clase ProductManager para gestionar productos.
    const productos = new ProductManager()

    // //Preguntar por todos los productos agregados
    // console.log(`\nLos productos ya agregados son:`)
    // let prods = await productos.getProducts()
    // console.log(prods.data)
    

    //Agregar productos a la class
    console.log(`\nAgregando los libros:`)

    let prod1 = await productos.addProducts({ title: 'OMA 1', description: 'Problemas de olimpiadas nivel 1', price: 4000, code: 1234, stock: 10, category: "OMA" })
    let prod2 = await productos.addProducts({ title: 'OMA 2', description: 'Problemas de olimpiadas nivel 2', price: 4000, thumbnail: ['OMA2.jpg', 'OMA2.1.jpg', 'OMA2.2.jpg'], code: 1235, stock: 10, category: "OMA" })
    let prod3 = await productos.addProducts({ title: 'OMA 3', description: 'Problemas de olimpiadas nivel 3', price: 4000, code: 1236, stock: 10, category: "OMA" })
    let prod4 = await productos.addProducts({ title: 'OMA 4', description: 'Problemas de olimpiadas nivel 4', price: 4000, thumbnail: ['OMA4.jpg', 'OMA4.1.jpg', 'OMA4.2.jpg'], code: 1237, stock: 10, category: "OMA" })
    let prod5 = await productos.addProducts({ title: 'OMA 5', description: 'Problemas de olimpiadas nivel 5', price: 4000, thumbnail: 'OMA5.jpg', code: 1238, stock: 10, category: "OMA" })
    let prod6 = await productos.addProducts({ title: 'OMA 6', description: 'Problemas de olimpiadas nivel 6', price: 4000, thumbnail: 'OMA6.jpg', code: 1239, stock: 2, category: "OMA" })


    // //Validar todos los campos son oblicatorios
    // console.log(`\nPrueba de todos los campos son obligatorios`)
    // let prod7 = await productos.addProducts({ title: 'OMA 3', description: 'Problemas de olimpiadas nivel 3', thumbnail: 'OMA3.jpg', code: 1236, stock: 10 })

    // console.log(prod7.error)

    // //Validar si el código ya existe
    // console.log(`\nPrueba de código identificador repetido`)
    // let prod8 = await productos.addProducts({ title: 'OMA 7', description: 'Problemas de olimpiadas nivel 7', price: '$4000', thumbnail: 'OMA7.jpg', code: 1237, stock: 10, category: "OMA"})

    // console.log(prod8.error)

    // //Preguntar por todos los productos agregados
    // console.log(`\nPrueba de todos los productos agregados`)
    // let prods2 = await productos.getProducts()
    // console.log(prods2.data)

    // //Preguntar por un producto según su id
    // console.log(`\nPrueba de buscar un producto según su id`)
    // let busqueda1 = await productos.getProductById(2)
    // let busqueda2 = await productos.getProductById(4)
    
    // console.log(busqueda1.message)
    // console.log(busqueda1.data)
    // console.log(busqueda2.message)
    // console.log(busqueda2.data)

    // //Eliminar un producto según su id
    // console.log(`\nEliminar un producto según su id`)
    // let eliminar1 = await productos.deleteProduct(1)
    // let eliminar2 = await productos.deleteProduct(2)

    // console.log(eliminar1.message)
    // console.log(eliminar1.data)
    // console.log(eliminar1.error)

    // console.log(eliminar2.message)
    // console.log(eliminar2.data)
    // console.log(eliminar2.error)

    // //Preguntar por todos los productos agregados
    // console.log(`\nPrueba de todos los productos agregados`)
    // let prods3 = await productos.getProducts()
    // //console.log(prods3.data)

    //Modificar los campos de un producto
    // console.log(`\nPrueba de modificación de un producto`)
    // await productos.updateProduct(6, { price: "$50000", stock: 150 })

    // //Preguntar por todos los productos agregados
    // console.log(`\nPrueba de todos los productos agregados`)
    // let prods4 = await productos.getProducts()
    // //console.log(prods4.data)
})()