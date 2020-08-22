import React, { useState as useStateMock } from 'react'
import { render } from '@testing-library/react'
import SearchPokemon from './SearchPokemon'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))

describe('test search pokemon component', () => {
  const setState = jest.fn()

  beforeEach(() => {
    ;(useStateMock as jest.Mock).mockImplementation(init => [init, setState])
  })

  it('renders search pokemon component', () => {
    const [namePokemonSearch, setNamePokemonSearch] = useStateMock('')

    const component = render(
      <SearchPokemon
        namePokemonSearch={namePokemonSearch}
        setNamePokemonSearch={setNamePokemonSearch}
      />
    )

    expect(component).toBeDefined()
  })
})
