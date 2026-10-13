# Autoclasificado — frontend

Interfaz web de un agregador de autos usados. Muestra en un solo lugar las
publicaciones de motordil y v6 que junta el
[backend](https://github.com/JA04/autoclasificado_back), con estética retro
monocromática (e-ink / Mac de los 90).

Stack: React 19, Vite, Tailwind CSS 4. Sin más dependencias.

## Inicio rápido

Necesitás Node 20+ y el backend corriendo en `http://localhost:8000`
(`make run` en su repo).

```bash
npm install
npm run dev      # http://localhost:5173
```

| Comando           | Qué hace                                    |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en vivo  |
| `npm run build`   | Genera la versión de producción en `dist/`  |
| `npm run preview` | Sirve `dist/` para probar el build          |

## Qué hace

- **Listado:** grilla de cards con modelo, año, kilometraje (`119.000 km`), precio
  (`USD 11.000`, `ARS 35.000.000`), provincia y portal de origen. Los datos que faltan
  se muestran como `—` o `Consultar`.
- **Aviso original:** cada card es un link que abre la publicación en otra pestaña.
- **Filtro por provincia:** un select con las 24 provincias.
- **Buscador por modelo:** busca solo en el título, cuando dejás de escribir.
- **Paginado:** 24 autos por página, con el rango y el total en la barra inferior.
- **Estados:** carga, sin resultados y error de conexión (con botón para reintentar).

## Conexión con la API

Por defecto el front llama a `/api` y Vite reenvía esos requests a
`http://localhost:8000`, así el navegador no hace requests entre orígenes.

| Variable            | Dónde            | Para qué                                                   |
| ------------------- | ---------------- | ---------------------------------------------------------- |
| `API_PROXY_TARGET`  | entorno de shell | Cambia a dónde apunta el proxy de desarrollo               |
| `VITE_API_BASE_URL` | archivo `.env`   | Llama directo a esa URL, sin proxy (ver `.env.example`)    |

```bash
API_PROXY_TARGET=http://localhost:8001 npm run dev
```

El proxy solo existe en `npm run dev`. Para un build de producción hay que definir
`VITE_API_BASE_URL` y agregar el dominio del front a `CORS_ORIGINS` en el backend.

El front usa `GET /cars` con los parámetros `province`, `q`, `limit` y `offset`, y lee
el total de resultados del header `X-Total-Count`.

## Estructura

```text
src/
├── components/
│   ├── Header.jsx          # barra de título
│   ├── ProvinceFilter.jsx  # select de provincias
│   ├── SearchBox.jsx       # buscador por modelo
│   ├── CarGrid.jsx         # grilla de cards
│   ├── CarCard.jsx         # una publicación
│   └── Pagination.jsx      # anterior / siguiente
├── services/
│   └── api.js              # llamada a GET /cars
├── App.jsx                 # estado: filtros, página, carga y errores
├── index.css               # Tailwind y tema (colores, tipografías)
└── main.jsx
```

## Diseño

Paleta en blanco, negro y grises; bordes sólidos de 1 o 2 px; esquinas rectas; sin
sombras, desenfoques ni degradados de color. Los colores y tipografías se definen en
el bloque `@theme` de `src/index.css` (Tailwind 4 no usa `tailwind.config.js`).
