// ============================================================
// 1. REFERENCIAS AL DOM
// getElementById "agarra" un elemento del HTML por su id.
// ============================================================
const grid = document.getElementById("grid");
const spinner = document.getElementById("spinner");
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
  spinner.classList.remove("oculto"); // mostramos el spinner de carga

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
    spinner.classList.add("oculto"); // ocultamos el spinner
  } catch (error) {
    spinner.classList.add("oculto");
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
    <button class="btn-fav" title="Marcar favorito">${esFavorito(personaje.id) ? "❤️" : "🤍"}</button>
    <h3>${personaje.name}</h3>
    <span class="estado ${personaje.status}">${personaje.status}</span>
    <p>${personaje.species}</p>
  `;

  // clic en la tarjeta → abre el detalle del personaje
  div.addEventListener("click", () => mostrarDetalle(personaje));

  // clic en el corazón → marca/quita favorito, SIN abrir el modal
  const btnFav = div.querySelector(".btn-fav");
  btnFav.addEventListener("click", (event) => {
    event.stopPropagation(); // evita que el clic "suba" al div y abra el modal
    toggleFavorito(personaje);
  });

  return div;
}

// ============================================================
// 7. FAVORITOS CON LOCALSTORAGE
// ============================================================
// ¿El personaje ya está en favoritos?
function esFavorito(id) {
  // some() → true si al menos un elemento cumple la condición
  return favoritos.some((personaje) => personaje.id === id);
}

// Añade o quita un personaje de favoritos y lo guarda en localStorage
function toggleFavorito(personaje) {
  if (esFavorito(personaje.id)) {
    // si ya está, lo quitamos
    favoritos = favoritos.filter((p) => p.id !== personaje.id);
  } else {
    // si no, lo añadimos (guardamos el objeto completo para usarlo en la vista)
    favoritos.push(personaje);
  }

  // localStorage solo guarda texto → convertimos el array a JSON
  localStorage.setItem("favoritos-rm", JSON.stringify(favoritos));

  renderizar(); // repintamos para actualizar los corazones
}

// ============================================================
// 6. DETALLE DEL PERSONAJE (MODAL)
// ============================================================
function mostrarDetalle(personaje) {
  // Convertimos cada URL de episodio en su código SxxExx
  // Ej: .../episode/28 -> id 28 -> S03E08
  const episodios = (personaje.episode || [])
    .map((url) => url.split("/").pop()) // cogemos el número final de cada URL
    .map((id) => {
      // cada 10 episodios hay 1 temporada
      const temporada = Math.ceil(id / 10);
      // capítulo: uso 10 cuando el resto es 0 (episodio 20 -> E10)
      const capitulo = id % 10 === 0 ? 10 : id % 10;
      return `S${String(temporada).padStart(2, "0")}E${String(capitulo).padStart(2, "0")}`;
    })
    .join(", ");

  detalle.innerHTML = `
    <img src="${personaje.image}" alt="${personaje.name}" />
    <h2>${personaje.name}</h2>
    <p><strong>Estado:</strong> ${personaje.status}</p>
    <p><strong>Especie:</strong> ${personaje.species}</p>
    <p><strong>Género:</strong> ${personaje.gender}</p>
    <p><strong>Origen:</strong> ${personaje.origin.name}</p>
    <p><strong>Localización:</strong> ${personaje.location.name}</p>
    <p class="episodios"><strong>Aparece en:</strong> ${episodios}</p>
  `;

  modal.classList.remove("oculto"); // mostramos el modal
}

// Cerrar el modal con el botón X
btnCerrar.addEventListener("click", () => modal.classList.add("oculto"));

// Cerrar el modal si se hace clic fuera de la caja
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.add("oculto");
});

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

// Mostrar / ocultar la vista de favoritos
btnFavoritos.addEventListener("click", () => {
  soloFavoritos = !soloFavoritos; // alternamos el estado
  btnFavoritos.textContent = soloFavoritos ? "⭐ Ver todos" : "❤️ Ver favoritos";

  // en la vista de favoritos no hay paginación
  if (soloFavoritos) {
    btnCargarMas.classList.add("oculto");
  } else {
    btnCargarMas.classList.toggle("oculto", !urlSiguiente);
  }

  renderizar();
});

// ============================================================
// 7. ARRANQUE: cargamos la primera página
// ============================================================
cargarPersonajes("https://rickandmortyapi.com/api/character");