// ============================================================
// 1. REFERENCIAS AL DOM
// getElementById "agarra" un elemento del HTML por su id.
// ============================================================
const grid = document.getElementById("grid");
const buscador = document.getElementById("buscador");
const btnFavoritos = document.getElementById("btn-favoritos");
const btnCargarMas = document.getElementById("btn-cargar-mas");
const estado = document.getElementById("estado");
const modal = document.getElementById("modal");
const btnCerrar = document.getElementById("btn-cerrar");
const detalle = document.getElementById("detalle");

// ============================================================
// 2. ESTADO DE LA APP
// ============================================================
let personajes = []; // todos los personajes cargados de la API
let urlSiguiente = null; // URL de la siguiente página (la da la API)
let favoritos = JSON.parse(localStorage.getItem("favoritos-rm")) || []; // favoritos guardados
let soloFavoritos = false; // ¿estamos viendo solo favoritos?
let filtroEstado = "all"; // filtro de estado activo
let textoBusqueda = ""; // texto del buscador

// ============================================================
// 3. CARGA DE DATOS DESDE LA API
// ============================================================
async function cargarPersonajes(url) {
  mostrarEstado("Cargando personajes...");

  try {
    // await "congela" la ejecución hasta que la API responda
    const respuesta = await fetch(url);
    // si la respuesta no es correcta (404, 500...), lanzamos un error
    if (!respuesta.ok) throw new Error("Respuesta incorrecta de la API");

    const datos = await respuesta.json();
    urlSiguiente = datos.info.next; // URL de la siguiente página (o null)
    personajes.push(...datos.results); // añadimos los nuevos personajes

    renderizar();
    btnCargarMas.classList.toggle("oculto", soloFavoritos || !urlSiguiente);
    ocultarEstado();
  } catch (error) {
    mostrarEstado("Error al cargar los personajes. Revisa tu conexión.", true);
  }
}

// Arma la URL de la API según el buscador y el filtro activos
function construirUrl() {
  let url = "https://rickandmortyapi.com/api/character?page=1";
  if (textoBusqueda) url += `&name=${textoBusqueda}`;
  if (filtroEstado !== "all") url += `&status=${filtroEstado}`;
  return url;
}

// Al cambiar búsqueda o filtro: en favoritos filtramos localmente;
// si no, reseteamos y pedimos de nuevo a la API
function actualizarResultados() {
  if (soloFavoritos) {
    renderizar(); // renderizar ya filtra los favoritos
  } else {
    personajes = [];
    urlSiguiente = null;
    cargarPersonajes(construirUrl());
    btnCargarMas.classList.add("oculto"); // mientras carga, ocultamos el botón
  }
}

// ============================================================
// 4. DIBUJAR LAS TARJETAS EN EL GRID
// ============================================================
function renderizar() {
  let lista = soloFavoritos ? favoritos : personajes;

  // Si estamos viendo favoritos, filtramos localmente (sin tocar la API)
  if (soloFavoritos) {
    lista = lista.filter((personaje) => {
      const coincideTexto = personaje.name
        .toLowerCase()
        .includes(textoBusqueda.toLowerCase());
      const coincideEstado =
        filtroEstado === "all" ||
        personaje.status.toLowerCase() === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  grid.innerHTML = ""; // vaciamos el grid antes de pintar

  if (lista.length === 0) {
    estado.textContent = "No hay personajes para mostrar.";
    estado.classList.remove("oculto");
    return;
  }

  // por cada personaje creamos una tarjeta HTML y la metemos en el grid
  lista.forEach((personaje) => {
    const tarjeta = crearTarjeta(personaje);
    grid.appendChild(tarjeta);
  });
}

function crearTarjeta(personaje) {
  const div = document.createElement("div");
  div.className = "tarjeta";

  div.innerHTML = `
    <img src="${personaje.image}" alt="${personaje.name}" />
    <h3>${personaje.name}</h3>
    <span class="estado ${personaje.status}">${personaje.status}</span>
    <p>${personaje.species}</p>
  `;

  return div;
}

// ============================================================
// 5. AYUDA: mostrar / ocultar mensajes de estado
// ============================================================
function mostrarEstado(mensaje, esError = false) {
  estado.textContent = mensaje;
  estado.classList.toggle("error", esError);
  estado.classList.remove("oculto");
}

function ocultarEstado() {
  estado.classList.add("oculto");
}

// ============================================================
// 6. EVENTOS
// ============================================================
// Búsqueda en tiempo real
buscador.addEventListener("input", (event) => {
  textoBusqueda = event.target.value.trim();
  actualizarResultados();
});

// Filtros por estado (Vivos, Muertos, Desconocidos, Todos)
document.querySelectorAll(".filtro").forEach((boton) => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    filtroEstado = boton.dataset.estado.toLowerCase();
    actualizarResultados();
  });
});

// Cargar más páginas
btnCargarMas.addEventListener("click", () => {
  if (urlSiguiente) cargarPersonajes(urlSiguiente);
});

// ============================================================
// 7. ARRANQUE: cargamos la primera página
// ============================================================
cargarPersonajes("https://rickandmortyapi.com/api/character");