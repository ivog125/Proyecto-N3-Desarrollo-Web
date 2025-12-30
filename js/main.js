document.addEventListener("DOMContentLoaded", () => {

    // Referencias al DOM
    const galeria = document.querySelector(".galeria");
    const modal = document.getElementById("modal");
    const titulo = document.getElementById("modal-titulo");
    const descripcion = document.getElementById("modal-descripcion");
    const consumo = document.getElementById("modal-consumo");
    const closeBtn = document.querySelector(".close");

    // Función para mostrar productos
    function mostrarProductos(productos) {
        galeria.innerHTML = ""; // Limpiamos galería

        productos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");

            div.innerHTML = `
                <img src="${producto.imagen}" class="imagenProducto" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <div class="accionesProducto">
                    <button class="btn-saber-mas"
                        data-titulo="${producto.nombre}"
                        data-descripcion="${producto.descripcion}"
                        data-consumo="${producto.consumo}">
                        Saber más
                    </button>
                    <button class="btnComprar" data-id="${producto.id}">Comprar</button>
                </div>
            `;
            galeria.appendChild(div);
        });
    }

    // Mostrar productos al cargar
    mostrarProductos(productos);

    // Delegación de eventos para botones "Saber más"
    galeria.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-saber-mas")) {
            const btn = e.target;
            titulo.textContent = btn.dataset.titulo;
            descripcion.textContent = btn.dataset.descripcion;
            consumo.textContent = btn.dataset.consumo;
            modal.style.display = "block";
        }
    });

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

});