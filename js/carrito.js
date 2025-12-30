// ===============================
//        CARRITO DE COMPRAS
// ===============================

// Estado del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===============================
// RENDER DEL CARRITO (carrito.html)
// ===============================
function renderCarrito() {
    const contenedor = document.getElementById("carritoContenedor");
    const totalSpan = document.getElementById("totalCarrito");

    if (!contenedor || !totalSpan) return;

    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
        totalSpan.textContent = 0;
        return;
    }

 carrito.forEach(prod => {
    const subtotal = prod.precio * prod.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "carritoItem";

    div.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">

        <div class="carritoInfo">
            <h4>${prod.nombre}</h4>
            <p>Precio unitario: $${prod.precio}</p>
            <p class="subtotalProducto">
                Subtotal: $${prod.precio * prod.cantidad}
            </p>
        </div>

        

        <div class="controlesCantidad">
            <button class="btnMenos" data-id="${prod.id}" ${prod.cantidad === 1 ? "disabled" : ""}>-</button>
            <span>${prod.cantidad}</span>
            <button class="btnMas" data-id="${prod.id}">+</button>
        </div>

        <button class="btnEliminar" data-id="${prod.id}">🗑</button>
    `;

        contenedor.appendChild(div);
    });

    totalSpan.textContent = total;
    guardarCarrito();
}

// ===============================
// EVENTOS + / - / ELIMINAR
// ===============================
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btnMas")) {
        const id = e.target.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod) {
            prod.cantidad++;
            renderCarrito();
        }
    }

    if (e.target.classList.contains("btnMenos")) {
        const id = e.target.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod && prod.cantidad > 1) {
            prod.cantidad--;
            renderCarrito();
        }
    }

    if (e.target.classList.contains("btnEliminar")) {
        const id = e.target.dataset.id;
        carrito = carrito.filter(p => p.id !== id);
        renderCarrito();
    }

    if (e.target.classList.contains("btnVaciar")) {
        carrito = [];
        localStorage.removeItem("carrito");
        renderCarrito();
        actualizarContador();
    }
});

// ===============================
// GUARDAR CARRITO
// ===============================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

// ===============================
// AGREGAR PRODUCTO DESDE TIENDA
// ===============================
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
}

// ===============================
// CONTADOR FLOTANTE
// ===============================
function actualizarContador() {
    const contador = document.querySelector(".contadorCarrito");
    if (!contador) return;

    const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    contador.textContent = total;
}

// ===============================
// INICIALIZACIÓN
// ===============================
actualizarContador();
renderCarrito();

// ==================
//  BOTON COMPRAR
//===================

const btnComprar = document.getElementById("btnComprar");

if (btnComprar) {
    btnComprar.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }

        let mensaje = "Hola! 👋 Quiero realizar el siguiente pedido:%0A%0A";
        mensaje += "🛒 *Pedido Tienda Ross*%0A";

        let total = 0;

        carrito.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            total += subtotal;

            mensaje += `- ${prod.nombre} x${prod.cantidad} — $${subtotal}%0A`;
        });

        mensaje += `%0A💰 *Total: $${total}*%0A%0A`;
        mensaje += "Quedo atento/a para coordinar el pago y la entrega. ¡Gracias!";

        const telefono = "5491138677830"; 
        const url = `https://wa.me/${telefono}?text=${mensaje}`;

        window.open(url, "_blank");
    });
}