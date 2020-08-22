import React, { useState as useStateMock } from 'react'
import { render } from '@testing-library/react'
import PokemonFilter from './PokemonFilter'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))

describe('test pokemon filter', () => {
  const types = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dragon',
  ]

  const setState = jest.fn()

  beforeEach(() => {
    ;(useStateMock as jest.Mock).mockImplementation(init => [init, setState])
  })

  it('renders filter pokemon types', () => {
    const [type, setType] = useStateMock([])

    const { getAllByTestId } = render(
      <PokemonFilter filter={type} setFilter={setType} showFilter={true} />
    )

    expect(getAllByTestId('checkboxFilter').length).toBe(types.length)
  })

  it('renders filter pokemon types and weaknesses', () => {
    const [types, setTypes] = useStateMock([])
    const [weaknesses, setWeaknesses] = useStateMock([])

    const { getAllByTestId } = render(
      <div>
        <PokemonFilter filter={types} setFilter={setTypes} showFilter={true} />
        <PokemonFilter
          filter={weaknesses}
          setFilter={setWeaknesses}
          showFilter={true}
        />
      </div>
    )

    expect(getAllByTestId('checkboxFilter').length).toBe(30)
  })

  it('renders filter types with Normal and Ghost selected', () => {
    const [type, setType] = useStateMock(['Normal', 'Ghost'])

    const { getAllByTestId } = render(
      <PokemonFilter filter={type} setFilter={setType} showFilter={true} />
    )

    expect(getAllByTestId('checkboxFilter')[0].checked).toBe(true)
    expect(getAllByTestId('checkboxFilter')[13].checked).toBe(true)
  })

  it('renders types with Normal and Ghost selected and weaknesses with Dragon selected', () => {
    const [types, setTypes] = useStateMock(['Normal', 'Ghost'])
    const [weaknesses, setWeaknesses] = useStateMock(['Dragon'])

    const { getAllByTestId } = render(
      <div>
        <PokemonFilter filter={types} setFilter={setTypes} showFilter={true} />
        <PokemonFilter
          filter={weaknesses}
          setFilter={setWeaknesses}
          showFilter={true}
        />
      </div>
    )

    expect(getAllByTestId('checkboxFilter')[0].checked).toBe(true)
    expect(getAllByTestId('checkboxFilter')[13].checked).toBe(true)
    expect(getAllByTestId('checkboxFilter')[29].checked).toBe(true)
  })
})
