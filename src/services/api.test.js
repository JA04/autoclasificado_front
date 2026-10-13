import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCars } from './api.js'

function mockFetch({ ok = true, status = 200, body = [], headers = {} } = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
    headers: new Headers(headers),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestedUrl(fetchMock) {
  return new URL(fetchMock.mock.calls[0][0], 'http://localhost')
}

afterEach(() => vi.unstubAllGlobals())

describe('fetchCars', () => {
  it('pide /api/cars con limit 50 y offset 0 por defecto', async () => {
    const fetchMock = mockFetch()

    await fetchCars()

    const url = requestedUrl(fetchMock)
    expect(url.pathname).toBe('/api/cars')
    expect(Object.fromEntries(url.searchParams)).toEqual({ limit: '50', offset: '0' })
  })

  it('manda provincia, búsqueda y paginado como parámetros', async () => {
    const fetchMock = mockFetch()

    await fetchCars({ province: 'Córdoba', search: 'gol trend', limit: 24, offset: 48 })

    expect(Object.fromEntries(requestedUrl(fetchMock).searchParams)).toEqual({
      limit: '24',
      offset: '48',
      province: 'Córdoba',
      q: 'gol trend',
    })
  })

  it('no manda province ni q cuando están vacíos', async () => {
    const fetchMock = mockFetch()

    await fetchCars({ province: '', search: '' })

    const params = requestedUrl(fetchMock).searchParams
    expect(params.has('province')).toBe(false)
    expect(params.has('q')).toBe(false)
  })

  it('pasa la señal de cancelación a fetch', async () => {
    const fetchMock = mockFetch()
    const controller = new AbortController()

    await fetchCars({ signal: controller.signal })

    expect(fetchMock.mock.calls[0][1]).toEqual({ signal: controller.signal })
  })

  it('devuelve los autos y el total del header X-Total-Count', async () => {
    const cars = [{ id: 1 }, { id: 2 }]
    mockFetch({ body: cars, headers: { 'X-Total-Count': '476' } })

    await expect(fetchCars()).resolves.toEqual({ cars, total: 476 })
  })

  it('sin header, calcula el total con el offset y lo recibido', async () => {
    mockFetch({ body: [{ id: 1 }, { id: 2 }] })

    const { total } = await fetchCars({ offset: 24 })

    expect(total).toBe(26)
  })

  it('falla si la API responde con error', async () => {
    mockFetch({ ok: false, status: 500 })

    await expect(fetchCars()).rejects.toThrow('La API respondió 500')
  })
})
