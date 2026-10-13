import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from './SearchBox.jsx'

describe('SearchBox', () => {
  it('muestra el texto actual', () => {
    render(<SearchBox value="corolla" onChange={() => {}} />)

    expect(screen.getByLabelText('Modelo:')).toHaveValue('corolla')
  })

  it('avisa lo que se escribe', async () => {
    const onChange = vi.fn()
    render(<SearchBox value="" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('Modelo:'), 'g')

    expect(onChange).toHaveBeenCalledWith('g')
  })
})
