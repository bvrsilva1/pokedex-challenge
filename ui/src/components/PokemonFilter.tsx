import React from 'react'
import { Checkbox } from 'nes-react'

interface PokemonFilterProps {
  filter: string[]
  setFilter: Function
  showFilter: boolean
}

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

const PokemonFilter: React.FC<PokemonFilterProps> = ({ filter, setFilter }) => {
  const isChecked = (type: string) => {
    return filter.includes(type)
  }

  const handleSelectCheckbox = (selectedType: string) => {
    if (isChecked(selectedType)) {
      const updatedFilter = filter.filter(type => type !== selectedType)
      setFilter(updatedFilter)
    } else {
      setFilter([...filter, selectedType])
    }
  }

  return (
    <div>
      {types.map((type, index) => (
        <Checkbox
          key={index}
          label={type}
          checked={isChecked(type)}
          onSelect={() => handleSelectCheckbox(type)}
        />
      ))}
    </div>
  )
}

export default PokemonFilter
