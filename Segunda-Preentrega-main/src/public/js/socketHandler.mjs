const productsInnerHTML = (array) => {
    let cards = ""
    for(let i = 0; i < array.length; i++){
        cards += `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" alt="${array[i].title}"> 
            <div class="card-body">
                <h5 class="card-title">${array[i].title}</h5>
                <p class="card-text">Descripción: ${array[i].description}</p>
                <p class="card-price">Precio por unidad: $${array[i].price}</p>
                <p class="card-category">Categoría: ${array[i].category}</p>
            </div>
        </div>
        `
    }

    return cards
}

const socket = io()

//Emito y recibo mensaje simple de conexion
socket.emit('mensajeConexion', 'Hola servidor')
socket.on('mensaje', (data) => {
    console.log(data)
})

//Recibo desde el Front los productos del Back que vienen de products.routes.js por los metodos post, delete, put.. Luego los envio de nuevo al back, para que los reciba realTimeProds a donde tengo encendida mi conexion io.on.. 
socket.on('actualizarProductos', (data) => {
    socket.emit('dataProducts', data)
})

const productsRealTime = document.querySelector('.productsRealTime')

//Recibimos los productos listos como data, a donde estan los productos actualizados, solo con algunas propiedades necesarias para hacer una funcion que los puestre por html y actualice la pagina. 
socket.on('productsListos', (data) => {
    const htmlListo = productsInnerHTML(data)
    productsRealTime.innerHTML = htmlListo 
})
