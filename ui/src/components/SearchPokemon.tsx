import React, { useEffect } from 'react'

interface SearchPokemonProps {
  namePokemonSearch: string
  setNamePokemonSearch(namePokemonSearch: string): void
}

const SearchPokemon: React.FC<SearchPokemonProps> = ({
  namePokemonSearch,
  setNamePokemonSearch,
}) => {
  useEffect(() => {
    if (namePokemonSearch && namePokemonSearch.trim().length > 0) {
      setNamePokemonSearch(namePokemonSearch)
    }
  }, [setNamePokemonSearch])

  return (
    <div className="search__pokemon">
      <input
        data-testid="inputSearchPokemon"
        type="text"
        onChange={event => setNamePokemonSearch(event.target.value)}
        placeholder="Type the name of a Pokemon"
        id="name_field"
        className="nes-input"
      />
    </div>
  )
}

export default SearchPokemon
