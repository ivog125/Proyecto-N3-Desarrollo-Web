// ===============================
//        ESTADO DEL CARRITO
// ===============================
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
        contenedor.innerHTML = `
            <div class="carritoVacio" data-aos="fade-in">
                <p>Tu carrito está vacío 🛒</p>
                <a href="./tienda.html" class="btnSeguir">Ir a la tienda</a>
            </div>`;
        totalSpan.textContent = 0;
        return;
    }

    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "carritoItem";
        div.setAttribute("data-aos", "fade-right"); // Animación AOS al cargar items

        div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">

            <div class="carritoInfo">
                <h4>${prod.nombre}</h4>
                <p class="subtotalProducto">
                    $${prod.precio.toLocaleString('es-AR')} x ${prod.cantidad}
                </p>
            </div>

            <div class="controlesCantidad">
                <button class="btnMenos" data-id="${prod.id}" ${prod.cantidad === 1 ? "disabled" : ""}>-</button>
                <span>${prod.cantidad}</span>
                <button class="btnMas" data-id="${prod.id}">+</button>
            </div>

            <button class="btnEliminar" data-id="${prod.id}" aria-label="Eliminar ${prod.nombre}">Eliminar</button>
        `;

        contenedor.appendChild(div);
    });

    totalSpan.textContent = total.toLocaleString('es-AR');
    guardarCarrito();
}

// ===============================
// EVENTOS + / - / ELIMINAR / VACIAR
// ===============================
document.addEventListener("click", (e) => {

    // Lógica para aumentar cantidad
    if (e.target.classList.contains("btnMas")) {
        const id = e.target.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod) {
            prod.cantidad++;
            renderCarrito();
        }
    }

    // Lógica para disminuir cantidad
    if (e.target.classList.contains("btnMenos")) {
        const id = e.target.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod && prod.cantidad > 1) {
            prod.cantidad--;
            renderCarrito();
        }
    }

    // Eliminar un producto específico
    if (e.target.classList.contains("btnEliminar")) {
        const id = e.target.dataset.id;
        carrito = carrito.filter(p => p.id !== id);
        renderCarrito();
    }

    // Vaciar todo el carrito (Con SweetAlert2)
    if (e.target.classList.contains("btnVaciar")) {
        if (carrito.length === 0) return;

        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2c3e50",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.removeItem("carrito");
                renderCarrito();
                actualizarContador();
                Swal.fire({
                    title: "¡Vaciado!",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        });
    }
});

// ===============================
// GUARDAR Y ACTUALIZAR
// ===============================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    const contador = document.querySelector(".contadorCarrito");
    if (!contador) return;

    const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    contador.textContent = total;
}

// ===============================
// AGREGAR PRODUCTO (Desde Tienda)
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

    // Notificación Toast (Dinamismo Punto 2)
    Swal.fire({
        text: `${producto.nombre} agregado al carrito`,
        icon: "success",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
}

// ==================
//  BOTÓN COMPRAR (WhatsApp)
//===================
const btnComprar = document.getElementById("btnComprar");

if (btnComprar) {
    btnComprar.addEventListener("click", (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            Swal.fire({
                title: "Carrito vacío",
                text: "Agrega algún producto para continuar",
                icon: "info",
                confirmButtonColor: "#2c3e50"
            });
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
        mensaje += "Quedo atento/a para coordinar el pago. ¡Gracias!";

        const telefono = "5491138677830"; 
        const url = `https://wa.me/${telefono}?text=${mensaje}`;

        window.open(url, "_blank");
    });
}

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    actualizarContador();
    renderCarrito();
});