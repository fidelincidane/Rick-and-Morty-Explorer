# Rick and Morty Explorer

Aplicación web que consume la **API de Rick and Morty** para explorar y buscar personajes de la serie, construida con **HTML + CSS + JavaScript (Vanilla)**, pensada para desplegar en GitHub Pages.

## Demo en vivo 🌍

👉 **Ver sitio publicado:** [https://fidelincidane.github.io/Rick-and-Morty-Explorer/](https://fidelincidane.github.io/Rick-and-Morty-Explorer/)

## Tecnologías 🛠️

- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
- **Datos:** The Rick and Morty API (fetch)
- **Persistencia:** LocalStorage (favoritos)
- **Deploy:** GitHub Pages

## Requisitos 📋

- Navegador moderno (Chrome, Edge, Firefox, Safari)
- Conexión a internet (para consumir la API)

## Instalación local 🚀

No se necesita instalar nada. Solo:

```
# 1) Clonar el repositorio
git clone https://github.com/fidelincidane/Rick-and-Morty-Explorer.git

# 2) Abrir index.html en el navegador
```

O abrir la carpeta en **VS Code** y usar la extensión **Live Server** para desarrollo con recarga automática.

## Funcionalidades ✨

- **Listado de personajes** — Tarjetas con nombre, imagen, estado y especie
- **Buscador por nombre** — Filtra en tiempo real (insensible a mayúsculas)
- **Filtros por estado** — Vivos, Muertos o Desconocidos
- **Detalle del personaje** — Modal con origen, localización y lista de episodios (SxxExx)
- **Paginación** — Botón "Cargar más" para mostrar más personajes
- **Favoritos** — Guardados en LocalStorage con corazón por tarjeta
- **Estados de carga y errores** — Spinner mientras carga y mensajes de error claros
- **Diseño responsivo** — Adaptado a móvil, tableta y desktop

## Estructura del proyecto 📁

```
├── index.html       # Estructura de la página
├── styles.css       # Estilos y diseño responsivo
├── app.js           # Lógica: fetch, búsqueda, filtros, modal y favoritos
└── README.md        # Documentación del proyecto
```

## Despliegue en GitHub Pages 🌐

### Pasos ✅

1. **Subir el proyecto a GitHub**
   - Crea el repositorio y sube los archivos con `git push`
2. **Activar GitHub Pages**
   - Ve a Settings -> Pages
   - Selecciona la rama `main` y la carpeta `/ (root)`
   - Guarda y espera 1-2 minutos
3. **Verificar en GitHub**
   - El sitio queda disponible en `https://fidelincidane.github.io/Rick-and-Morty-Explorer/`

## Datos de la API 🧪

Los datos provienen de [The Rick and Morty API](https://rickandmortyapi.com/), una API REST pública y gratuita con paginación integrada.

## Autor ✍️

Hecho por [@fidelincidane](https://github.com/fidelincidane) · 2026
