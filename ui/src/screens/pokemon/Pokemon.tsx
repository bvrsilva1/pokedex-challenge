import React, { useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { Container as NesContainer } from 'nes-react'
import SearchPokemon from '../../components/SearchPokemon'
import PokemonList from '../../components/PokemonsList'
import PokemonFilter from '../../components/PokemonFilter'
import './Pokemon.css'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;
    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const [namePokemonSearch, setNamePokemonSearch] = useState('')
  const [typesFilter, setTypesFilter] = useState([])
  const [weaknessFilter, setWeaknessFilter] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  return (
    <Container rounded>
      <SearchPokemon
        namePokemonSearch={namePokemonSearch}
        setNamePokemonSearch={setNamePokemonSearch}
      />
      {showFilter ? (
        <div>
          <div className="filters">
            <div className="filters__types">
              <p>Types</p>
              <PokemonFilter
                filter={typesFilter}
                setFilter={setTypesFilter}
                showFilter={showFilter}
              />
            </div>
            <div className="filters__weaknesses">
              <p>Weaknesses</p>
              <PokemonFilter
                filter={weaknessFilter}
                setFilter={setWeaknessFilter}
                showFilter={showFilter}
              />
            </div>
          </div>

          <p onClick={() => setShowFilter(!showFilter)}>hide filters</p>
        </div>
      ) : (
        <div>
          <p onClick={() => setShowFilter(!showFilter)}>show filters</p>
        </div>
      )}
      <PokemonList
        namePokemonSearch={namePokemonSearch}
        typesFilter={typesFilter}
        weaknessFilter={weaknessFilter}
        clickLink={clickLink}
      />
    </Container>
  )
}

export default Pokemon
