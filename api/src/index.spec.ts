import pokemon from './pokemon.json'
import { filterPokemons, fetchPokemonsByName, searchAndFilter } from './index'

describe('test api', function () {
  const pokemons = Object.values(pokemon)

  describe('pokemon list', () => {
    it('loads the pokemon list', () => {
      expect(pokemons.length).toBe(151)
    })
  })

  describe('filter', () => {
    it('results all pokemons without selecting any filter', () => {
      const filtered = filterPokemons(pokemons, [], [])
      expect(filtered.length).toBe(151)
    })
    it('gets pokemons type fire', () => {
      const filtered = filterPokemons(pokemons, ['Fire'], [])
      expect(filtered.length).toBe(12)
    })
    it('gets pokemons type fire and flying', () => {
      const filtered = filterPokemons(pokemons, ['Fire', 'Flying'], [])
      expect(filtered.length).toBe(2)
    })
    it('gets pokemons type fire and flying and weakness rock', () => {
      const filtered = filterPokemons(pokemons, ['Fire', 'Flying'], ['Rock'])
      expect(filtered.length).toBe(2)
    })
    it('gets pokemons type fire and flying and weakness rock and normal', () => {
      const filtered = filterPokemons(
        pokemons,
        ['Fire', 'Flying'],
        ['Rock', 'Normal']
      )
      expect(filtered.length).toBe(0)
    })

    describe('search', () => {
      it('no name for search', () => {
        const result = fetchPokemonsByName(pokemons, '')
        expect(result.length).toBe(0)
      })
      it('fuzzy search charzizard', () => {
        const result = fetchPokemonsByName(pokemons, 'charzizard')
        expect(result.length).toBe(5)
      })
    })

    describe('integration', () => {
      it('returns all pokemons', () => {
        const result = searchAndFilter('', [], [], 0, 999)
        expect(result.length).toBe(151)
      })
      it('fuzzy search', () => {
        const result = searchAndFilter('charzizard', [], [], 0, 999)
        expect(result.length).toBe(5)
      })

      it('fuzzy search and filter type', () => {
        const result = searchAndFilter('charzizard', ['Flying'], [], 0, 999)
        expect(result.length).toBe(2)
      })

      it('fuzzy search, filter type and weakness', () => {
        const result = searchAndFilter(
          'charzizard',
          ['Flying'],
          ['Water'],
          0,
          999
        )
        expect(result.length).toBe(1)
      })
    })
  })
})
