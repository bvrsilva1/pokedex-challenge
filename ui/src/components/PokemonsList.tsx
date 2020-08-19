import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'

const POKEMON_MANY = gql`
  query(
    $name: String
    $types: [String]
    $weaknesses: [String]
    $skip: Int
    $limit: Int
  ) {
    pokemonMany(
      name: $name
      types: $types
      weaknesses: $weaknesses
      skip: $skip
      limit: $limit
    ) {
      id
      name
      num
      img
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;
  > *:first-child {
    margin-right: 1rem;
  }
`
interface PokemonsListProps {
  namePokemonSearch: string
  typesFilter: string[]
  weaknessFilter: string[]
  clickLink: Function
}

const PokemonList: React.FC<PokemonsListProps> = ({
  namePokemonSearch,
  typesFilter,
  weaknessFilter,
  clickLink,
}) => {
  const { loading, error, data } = useQuery(POKEMON_MANY, {
    variables: {
      name: namePokemonSearch,
      types: typesFilter,
      weaknesses: weaknessFilter,
    },
  })
  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList) {
    return <p>Error!</p>
  }

  return (
    <List>
      {pokemonList.map(pokemon => (
        <Link to={pokemon.id} onMouseDown={clickLink as any}>
          <ListItem>
            <img src={pokemon.img} />
            {pokemon.name} - {pokemon.num}
          </ListItem>
        </Link>
      ))}
    </List>
  )
}

export default PokemonList
