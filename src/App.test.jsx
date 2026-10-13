import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'
import { fetchCars } from './services/api.js'
import { makeCar, makeCars } from './test/fixtures.js'

vi.mock('./services/api.js', () => ({ fetchCars: vi.fn() }))

function lastRequest() {
  return fetchCars.mock.lastCall[0]
}

beforeEach(() => {
  fetchCars.mockReset()
  // jsdom no implementa scrollTo
  window.scrollTo = vi.fn()
})

describe('App', () => {
  it('muestra el estado de carga y después las publicaciones', async () => {
    fetchCars.mockResolvedValue({ cars: [makeCar()], total: 1 })
    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando publicaciones')

    expect(await screen.findByRole('heading', { name: 'Toyota Corolla 1.8 XEI' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('1–1 de 1 publicación')).toBeInTheDocument()
  })

  it('pide la primera página de 24 sin filtros', async () => {
    fetchCars.mockResolvedValue({ cars: [], total: 0 })
    render(<App />)

    await waitFor(() => expect(fetchCars).toHaveBeenCalled())
    expect(lastRequest()).toMatchObject({ province: '', search: '', limit: 24, offset: 0 })
  })

  it('avisa cuando no hay resultados', async () => {
    fetchCars.mockResolvedValue({ cars: [], total: 0 })
    render(<App />)

    expect(await screen.findByText('[ No se encontraron vehículos ]')).toBeInTheDocument()
    expect(screen.getByText('0 publicaciones')).toBeInTheDocument()
  })

  it('muestra el error de conexión y permite reintentar', async () => {
    fetchCars.mockRejectedValueOnce(new Error('La API respondió 500'))
    fetchCars.mockResolvedValue({ cars: [makeCar()], total: 1 })
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor.')

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('heading', { name: 'Toyota Corolla 1.8 XEI' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('ignora los requests cancelados', async () => {
    const aborted = new Error('cancelado')
    aborted.name = 'AbortError'
    fetchCars.mockRejectedValue(aborted)
    render(<App />)

    await waitFor(() => expect(fetchCars).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('filtra por provincia', async () => {
    fetchCars.mockResolvedValue({ cars: [makeCar()], total: 1 })
    render(<App />)
    await screen.findByRole('link')

    await userEvent.selectOptions(screen.getByLabelText('Provincia:'), 'Mendoza')

    await waitFor(() => expect(lastRequest()).toMatchObject({ province: 'Mendoza', offset: 0 }))
  })

  it('busca por modelo una sola vez, cuando se deja de escribir', async () => {
    fetchCars.mockResolvedValue({ cars: [makeCar()], total: 1 })
    render(<App />)
    await screen.findByRole('link')

    await userEvent.type(screen.getByLabelText('Modelo:'), '  corolla ')

    await waitFor(() => expect(lastRequest()).toMatchObject({ search: 'corolla', offset: 0 }))
    const searches = fetchCars.mock.calls.map(([params]) => params.search)
    expect(searches).toEqual(['', 'corolla'])
  })

  it('pagina y muestra el rango en el pie', async () => {
    fetchCars.mockImplementation(async ({ offset }) => ({
      cars: offset === 0 ? makeCars(24) : makeCars(6, 25),
      total: 30,
    }))
    render(<App />)

    expect(await screen.findByText('1–24 de 30 publicaciones')).toBeInTheDocument()
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }))

    expect(await screen.findByText('25–30 de 30 publicaciones')).toBeInTheDocument()
    expect(lastRequest()).toMatchObject({ offset: 24 })
    expect(screen.getAllByRole('link')).toHaveLength(6)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
  })

  it('vuelve a la primera página al cambiar un filtro', async () => {
    fetchCars.mockImplementation(async ({ offset }) => ({
      cars: offset === 0 ? makeCars(24) : makeCars(6, 25),
      total: 30,
    }))
    render(<App />)
    await userEvent.click(await screen.findByRole('button', { name: /Siguiente/ }))
    await screen.findByText('Página 2 de 2')

    await userEvent.selectOptions(screen.getByLabelText('Provincia:'), 'Salta')

    await waitFor(() => expect(lastRequest()).toMatchObject({ province: 'Salta', offset: 0 }))
    expect(await screen.findByText('Página 1 de 2')).toBeInTheDocument()
  })

  it('no muestra el paginador si todo entra en una página', async () => {
    fetchCars.mockResolvedValue({ cars: makeCars(3), total: 3 })
    render(<App />)
    await screen.findAllByRole('link')

    expect(screen.queryByRole('navigation', { name: 'Paginación' })).not.toBeInTheDocument()
  })
})
