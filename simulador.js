const cepasDiv = document.getElementById('cepas');
const vinosDiv = document.getElementById('vinos');
const comprarBtn = document.getElementById('comprarBtn');
let vinosData = {}; // Variable para almacenar los datos de vinos

// Cargar datos desde el archivo JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    vinosData = data.cepas; // Almacenar las cepas en vinosData
  })
  .catch(error => console.error('Error al cargar los datos:', error));

// Manejo del botón "Comprar vino aquí"
comprarBtn.addEventListener('click', () => {
  comprarBtn.classList.add('animate__animated', 'animate__fadeOutUp');

  // Esperar a que termine la animación y luego ocultar el botón y mostrar cepas
  setTimeout(() => {
    comprarBtn.style.display = 'none';
    cepasDiv.style.display = 'flex';
    cepasDiv.classList.add('animate__animated', 'animate__bounceInLeft');
  }, 500); // Tiempo de duración de la animación
});

// Manejo de las cartas de cepas
document.querySelectorAll('#cepas .card').forEach(carta => {
  carta.addEventListener('click', () => {
    const cepaSeleccionada = carta.getAttribute('data-cepa');
    mostrarVinos(cepaSeleccionada);
  });
});

// Función para mostrar los vinos
function mostrarVinos(cepa) {
  vinosDiv.innerHTML = ''; 
  const vinosCepa = vinosData.find(item => item.nombre.toLowerCase() === cepa.toLowerCase()).vinos || [];

  vinosCepa.forEach(vino => {
    vinosDiv.innerHTML += `
      <div class="vino-card">
        <h4 style="color: #b11226; text-shadow: 1px 1px 2px #000;">${vino.marca}</h4>
        <p style="color: #333; text-shadow: 1px 1px 2px #b11226;">Precio por unidad: $${vino.precio}</p>
        <label for="cantidad_${vino.marca}">Cantidad de cajas:</label>
        <input type="number" id="cantidad_${vino.marca}" value="1" min="1" max="10">
        <button onclick="calcularPrecio('${vino.marca}', ${vino.precio})">Calcular precio</button>
        <div id="precio_total_${vino.marca}"></div>
        <button onclick="mostrarFormulario('${vino.marca}', ${vino.precio})">Comprar unidad</button>
        <button onclick="comprarCajas('${vino.marca}', ${vino.precio})">Comprar cajas</button>
        <img src="${vino.imagen}" alt="${vino.marca}" /> <!-- Mostrar imagen -->
      </div>
    `;
  });

  // Animaciones
  cepasDiv.classList.add('animate__animated', 'animate__fadeOutUp');
  setTimeout(() => {
    cepasDiv.style.display = 'none';
    vinosDiv.style.display = 'block';
    vinosDiv.classList.add('animate__animated', 'animate__fadeInLeft');
  }, 500); // Tiempo de duración de la animación
}

// Función para calcular el precio total
function calcularPrecio(marca, precio) {
  const cantidad = document.getElementById(`cantidad_${marca}`).value;
  let descuento = 0;

  if (cantidad >= 2) descuento = 0.05;
  if (cantidad >= 4) descuento = 0.10;
  if (cantidad >= 6) descuento = 0.15;

  const precioTotal = (precio * cantidad) * (1 - descuento);
  document.getElementById(`precio_total_${marca}`).innerText = `Precio total: $${precioTotal}`;
}

// Función para mostrar el formulario de compra
function mostrarFormulario(marca, precio) {
  // Limpiar el contenido de vinosDiv antes de mostrar el formulario
  vinosDiv.innerHTML = `
    <form id="formularioCompra" class="animate__animated animate__fadeIn">
      <h3>Datos de Compra</h3>
      <p>Producto seleccionado: ${marca}</p>
      <p>Precio por unidad: $${precio}</p>
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" required>
      <label for="direccion">Dirección:</label>
      <input type="text" id="direccion" required>
      <label for="email">Email:</label>
      <input type="email" id="email" required>
      <button type="submit">Finalizar compra</button>
    </form>
  `;

  // Agregar el evento para manejar el envío del formulario
  document.getElementById('formularioCompra').addEventListener('submit', guardarDatosUsuario);
}

// Función para comprar cajas
function comprarCajas(marca, precio) {
  const cantidad = document.getElementById(`cantidad_${marca}`).value;
  let descuento = 0;

  if (cantidad >= 2) descuento = 0.05;
  if (cantidad >= 4) descuento = 0.10;
  if (cantidad >= 6) descuento = 0.15;

  const precioTotal = (precio * cantidad) * (1 - descuento);
  
  // Limpiar el contenido de vinosDiv antes de mostrar el formulario
  vinosDiv.innerHTML = `
    <form id="formularioCompra" class="animate__animated animate__fadeIn">
      <h3>Datos de Compra</h3>
      <p>Producto seleccionado: ${marca}</p>
      <p>Precio total por ${cantidad} cajas: $${precioTotal.toFixed(2)}</p>
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" required>
      <label for="direccion">Dirección:</label>
      <input type="text" id="direccion" required>
      <label for="email">Email:</label>
      <input type="email" id="email" required>
      <button type="submit">Finalizar compra</button>
    </form>
  `;

  // Agregar el evento para manejar el envío del formulario
  document.getElementById('formularioCompra').addEventListener('submit', guardarDatosUsuario);
}

// Función para guardar los datos del usuario
function guardarDatosUsuario(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const email = document.getElementById('email').value;

  const usuario = {
    nombre,
    direccion,
    email
  };

  localStorage.setItem('comprador', JSON.stringify(usuario));
  alert('Compra registrada con éxito');

  // Vuelve al inicio
  resetearPagina();
}

// Función para reiniciar la página
function resetearPagina() {
  vinosDiv.style.display = 'none'; 
  comprarBtn.style.display = 'block'; 
  cepasDiv.style.display = 'none'; 
  comprarBtn.style.margin = '0 auto'; 
  cepasDiv.style.display = 'none';

  comprarBtn.classList.remove('animate__animated', 'animate__fadeOutUp');
  cepasDiv.classList.remove('animate__animated', 'animate__fadeOutUp');

  cepasDiv.style.display = 'none'; 
}
