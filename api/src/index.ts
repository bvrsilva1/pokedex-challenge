import { ApolloServer, gql, IResolvers } from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import intersection from 'lodash/intersection'
import pokemon from './pokemon.json'
import Fuse from 'fuse.js'

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonMany(
      name: String
      skip: Int
      limit: Int
      types: [String]
      weaknesses: [String]
    ): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
    pokemonName(name: String): [Pokemon!]!
  }
`
const pokemons: Pokemon[] = Object.values(pokemon)

/*

I've tried to implement my own fizzy search but it was not robust enough. I check the intersection 
of the both string sets, if this intersection has a considerable number of characters (0.7 in a scale from 0 to 1), 
then there is a match. 
After browsing about fuzzy search, I've found fuse.js, a lightweight library with zero dependencies. It has 11.1k stars 
on GitHub and its size is only 28.3kb. The library is well documented, has been used for for more than 5k developrs. 
It has been maintained by 64 contributors in total and the last commit was 24 days ago. The library has been tested 
and has no major issues.

It would be a good discussion with the dev team to decide if we are going to use this library in production, what 
are the best parameters for our fuzzy search and to make sure we do not reinvet the wheel.

*/

const fetchPokemonsByName = (pokemons: Pokemon[], name: string): Pokemon[] => {
  const options = {
    isCaseSensitive: false,
    keys: [
      {
        name: 'name',
        weight: 0.6,
      },
      {
        name: 'nextEvolutions.name',
        weight: 0.2,
      },
      {
        name: 'prevEvolutions.name',
        weight: 0.2,
      },
    ],
  }
  const fuse = new Fuse(pokemons, options)
  return fuse.search(name)

  // initial approach
  // return pokemons.filter(pokemon => {
  //   const pokemonName = new Set([...pokemon.name.toLowerCase()])
  //   const queryName = new Set([...name.toLowerCase()])
  //   const intersection = [...pokemonName].filter(character =>
  //     queryName.has(character)
  //   )
  //   const similarity = intersection.length / pokemonName.size
  //   if (similarity >= 0.7) return pokemon
  // })
}

const filterPokemons = (
  pokemons: Pokemon[],
  types: string[],
  weaknesses: string[]
): Pokemon[] => {
  return pokemons.filter(pokemon => {
    const intersectionTypes = intersection(pokemon.types, types)
    const intersectionWeaknesses = intersection(pokemon.weaknesses, weaknesses)
    if (
      types.length === intersectionTypes.length &&
      weaknesses.length === intersectionWeaknesses.length
    )
      return pokemon
  })
}

const searchAndFilter = (
  name: string,
  types: string[],
  weaknesses: string[],
  skip: number,
  limit: number
): Pokemon[] => {
  const shouldSearch = name && name.length >= 0 ? true : false
  const fetchedPokemons = shouldSearch
    ? fetchPokemonsByName(pokemons, name)
    : pokemons

  const souldFilter =
    (types && types.length > 0) || (weaknesses && weaknesses.length > 0)

  const filteredPokemons = souldFilter
    ? filterPokemons(fetchedPokemons, types, weaknesses)
    : fetchedPokemons

  return sortBy(filteredPokemons, poke => parseInt(poke.id, 10)).slice(
    skip,
    limit + skip
  )
}

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonMany(
      _,
      {
        name = '',
        skip = 0,
        limit = 999,
        types = [],
        weaknesses = [],
      }: {
        name?: string
        skip?: number
        limit?: number
        types?: string[]
        weaknesses?: string[]
      }
    ): Pokemon[] {
      return searchAndFilter(name, types, weaknesses, skip, limit)
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
