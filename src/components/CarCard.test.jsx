import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CarCard from './CarCard.jsx'
import { makeCar } from '../test/fixtures.js'

describe('CarCard', () => {
  it('muestra los datos del auto con formato argentino', () => {
    render(<CarCard car={makeCar()} />)

    expect(screen.getByRole('heading', { name: 'Toyota Corolla 1.8 XEI' })).toBeInTheDocument()
    expect(screen.getByText('2018')).toBeInTheDocument()
    expect(screen.getByText('119.000 km')).toBeInTheDocument()
    expect(screen.getByText('USD 11.000')).toBeInTheDocument()
    expect(screen.getByText('Córdoba')).toBeInTheDocument()
    expect(screen.getByText('motordil')).toBeInTheDocument()
  })

  it('formatea precios en pesos', () => {
    render(<CarCard car={makeCar({ price: 35000000, currency: 'ARS' })} />)

    expect(screen.getByText('ARS 35.000.000')).toBeInTheDocument()
  })

  it('abre el aviso original en otra pestaña', () => {
    render(<CarCard car={makeCar()} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://motordil.com/autos/1')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('usa textos de reemplazo para los datos que faltan', () => {
    render(<CarCard car={makeCar({ year: null, mileage: null, price: null, currency: null, province: null })} />)

    expect(screen.getAllByText('—')).toHaveLength(2)
    expect(screen.getByText('Consultar')).toBeInTheDocument()
    expect(screen.getByText('Provincia sin informar')).toBeInTheDocument()
  })

  it('muestra el precio sin moneda cuando no se conoce', () => {
    render(<CarCard car={makeCar({ currency: null })} />)

    expect(screen.getByText('11.000')).toBeInTheDocument()
  })

  it('muestra 0 km como kilometraje y no como dato faltante', () => {
    render(<CarCard car={makeCar({ mileage: 0 })} />)

    expect(screen.getByText('0 km')).toBeInTheDocument()
  })
})
