const productos = $('.productos li');
const listaCarrito = $('#lista-carrito');
let carrito = [];

if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  carrito.forEach((producto) => {
    const productoEnCarrito = $('<li></li>');
    productoEnCarrito.html(`
      <span>${producto.nombre} - Cantidad: ${producto.cantidad}</span>
      <button class="boton-quitar" data-nombre="${producto.nombre}">
        X
      </button>
    `);
    listaCarrito.append(productoEnCarrito);
  });
}

productos.each(function() {
  const botonAgregar = $(this).find('.boton-hijo-2');
  const botonQuitar = $(this).find('.boton-hijo-1');
  const contador = $(this).find('.parrafo-counter');
  const nombreProducto = $(this).find('h3').text();

  botonAgregar.on('click', function() {
    let cantidad = parseInt(contador.text());
    cantidad++;
    contador.text(cantidad);

    const index = carrito.findIndex((producto) => producto.nombre === nombreProducto);
    if (index !== -1) {
      carrito[index].cantidad = cantidad;
    } else {
      carrito.push({ nombre: nombreProducto, cantidad: cantidad });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    const productoEnCarrito = $('<li></li>');
    productoEnCarrito.html(`
      <span>${nombreProducto} - Cantidad: ${cantidad}</span>
      <button class="boton-quitar" data-nombre="${nombreProducto}">
        X
      </button>
    `);
    listaCarrito.append(productoEnCarrito);
  });

  botonQuitar.on('click', function() {
    let cantidad = parseInt(contador.text());
    if (cantidad > 0) {
      cantidad--;
      contador.text(cantidad);

      const index = carrito.findIndex((producto) => producto.nombre === nombreProducto);
      if (index !== -1) {
        carrito[index].cantidad = cantidad;
        if (cantidad === 0) {
          carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }

      const productosEnCarrito = $('#lista-carrito li');
      productosEnCarrito.each(function() {
        if ($(this).find('span').text() === `${nombreProducto} - Cantidad: ${cantidad + 1}`) {
          $(this).remove();
        }
      });
    }
  });
});

const botonComprar = $('.comprar button');

botonComprar.on('click', function() {
  listaCarrito.empty();
  carrito = [];
  localStorage.removeItem('carrito');
  alert('¡Gracias por su compra!');
});
fetch('/api/productos')
  .then(response => response.json())
  .then(data => {
    const productos = data.productos;
    const listaProductos = $('.productos');
    productos.forEach(producto => {
      const productoHTML = `
        <li>
          <h3>${producto.nombre}</h3>
          <p>Precio: ${producto.precio}</p>
          <button class="boton-hijo-1">-</button>
          <p class="parrafo-counter">0</p>
          <button class="boton-hijo-2">+</button>
        </li>
      `;
      listaProductos.append(productoHTML);
    });
  });
