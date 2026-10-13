import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import ProvinceFilter from './components/ProvinceFilter.jsx'
import SearchBox from './components/SearchBox.jsx'
import CarGrid from './components/CarGrid.jsx'
import Pagination from './components/Pagination.jsx'
import { fetchCars } from './services/api.js'

const PAGE_SIZE = 24
const SEARCH_DELAY_MS = 300

export default function App() {
  const [province, setProvince] = useState('')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [cars, setCars] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  // La búsqueda se dispara cuando el usuario deja de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim())
      setPage(0)
    }, SEARCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetchCars({ province, search, limit: PAGE_SIZE, offset: page * PAGE_SIZE, signal: controller.signal })
      .then((data) => {
        setCars(data.cars)
        setTotal(data.total)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [province, search, page, attempt])

  function handleProvinceChange(value) {
    setProvince(value)
    setPage(0)
  }

  function handlePageChange(value) {
    setPage(value)
    window.scrollTo({ top: 0 })
  }

  const pageCount = Math.ceil(total / PAGE_SIZE)
  const firstShown = page * PAGE_SIZE + 1
  const lastShown = page * PAGE_SIZE + cars.length

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-3 sm:p-6">
      <div className="border-2 border-ink bg-paper">
        <Header />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b-2 border-ink bg-paper px-3 py-2">
          <ProvinceFilter value={province} onChange={handleProvinceChange} />
          <SearchBox value={query} onChange={setQuery} />
        </div>

        <main className="min-h-[60vh] p-3 sm:p-4">
          {status === 'loading' && (
            <p role="status" className="py-16 text-center font-mono text-sm">
              [ Cargando publicaciones... ]
            </p>
          )}

          {status === 'error' && (
            <div role="alert" className="mx-auto my-12 max-w-md border-2 border-ink bg-white p-4 text-center">
              <p className="text-sm font-bold">No se pudo conectar con el servidor.</p>
              <p className="mt-1 font-mono text-xs text-neutral-600">
                Revisá que la API esté corriendo e intentá de nuevo.
              </p>
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="mt-4 cursor-pointer rounded-sm border-2 border-ink bg-white px-4 py-1 text-sm font-bold hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Reintentar
              </button>
            </div>
          )}

          {status === 'ready' && cars.length === 0 && (
            <p className="py-16 text-center font-mono text-sm">[ No se encontraron vehículos ]</p>
          )}

          {status === 'ready' && cars.length > 0 && (
            <>
              <CarGrid cars={cars} />
              <Pagination page={page} pageCount={pageCount} onChange={handlePageChange} />
            </>
          )}
        </main>

        <footer className="border-t-2 border-ink bg-white px-3 py-1 font-mono text-xs">
          {status !== 'ready' && ' '}
          {status === 'ready' && cars.length === 0 && '0 publicaciones'}
          {status === 'ready' &&
            cars.length > 0 &&
            `${firstShown}–${lastShown} de ${total} ${total === 1 ? 'publicación' : 'publicaciones'}`}
        </footer>
      </div>
    </div>
  )
}
