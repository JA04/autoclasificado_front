const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

// Devuelve { cars, total }: la página pedida y el total de resultados sin paginar.
export async function fetchCars({ province, search, limit = 50, offset = 0, signal } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (province) params.set('province', province)
  if (search) params.set('q', search)

  const response = await fetch(`${BASE_URL}/cars?${params}`, { signal })
  if (!response.ok) {
    throw new Error(`La API respondió ${response.status}`)
  }
  const cars = await response.json()
  const total = Number(response.headers.get('X-Total-Count') ?? offset + cars.length)
  return { cars, total }
}
