import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import PokemonList, { POKEMON_MANY } from './PokemonsList'
import { act } from 'react-dom/test-utils'

describe('test pokemon list', () => {
  const mocks = [
    {
      request: {
        query: POKEMON_MANY,
        variables: { name: '', types: [], weaknesses: [] },
      },
      result: {
        data: {
          message: 'hello',
        },
      },
    },
  ]

  it('renders PokemonList component', async () => {
    const component = act(() => {
      render(
        <MockedProvider mocks={mocks}>
          <PokemonList
            namePokemonSearch=""
            typesFilter={[]}
            weaknessFilter={[]}
            clickLink={() => {}}
          />
        </MockedProvider>
      )
    })

    expect(component).toBeDefined()
  })
})
