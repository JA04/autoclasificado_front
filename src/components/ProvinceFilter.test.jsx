import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProvinceFilter from './ProvinceFilter.jsx'

describe('ProvinceFilter', () => {
  it('ofrece "Todas" y las 24 provincias', () => {
    render(<ProvinceFilter value="" onChange={() => {}} />)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(25)
    expect(options[0]).toHaveTextContent('Todas')
    expect(options[0]).toHaveValue('')
  })

  it('marca la provincia elegida', () => {
    render(<ProvinceFilter value="Mendoza" onChange={() => {}} />)

    expect(screen.getByLabelText('Provincia:')).toHaveValue('Mendoza')
  })

  it('avisa la provincia seleccionada', async () => {
    const onChange = vi.fn()
    render(<ProvinceFilter value="" onChange={onChange} />)

    await userEvent.selectOptions(screen.getByLabelText('Provincia:'), 'Córdoba')

    expect(onChange).toHaveBeenCalledWith('Córdoba')
  })
})
