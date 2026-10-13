import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination.jsx'

describe('Pagination', () => {
  it('no se muestra si hay una sola página', () => {
    const { container } = render(<Pagination page={0} pageCount={1} onChange={() => {}} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('indica la página actual y el total', () => {
    render(<Pagination page={1} pageCount={5} onChange={() => {}} />)

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('deshabilita "Anterior" en la primera página', () => {
    render(<Pagination page={0} pageCount={3} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeEnabled()
  })

  it('deshabilita "Siguiente" en la última página', () => {
    render(<Pagination page={2} pageCount={3} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: /Anterior/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeDisabled()
  })

  it('avisa la página pedida al avanzar y al retroceder', async () => {
    const onChange = vi.fn()
    render(<Pagination page={1} pageCount={3} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }))
    await userEvent.click(screen.getByRole('button', { name: /Anterior/ }))

    expect(onChange.mock.calls).toEqual([[2], [0]])
  })
})
