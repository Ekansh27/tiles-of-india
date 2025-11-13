'use client'

import { Shuffle } from 'lucide-react'
import { useGame } from '../../../context/GameContext'
import { Tile } from './Tile'

export function TileGrid() {
  const {
    shuffledLetters,
    draggedIndex,
    handleScramble,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useGame()

  return (
    <div className="tiles-and-scramble">
      <div className="tiles-container">
        {shuffledLetters.map((letter, index) => (
          <Tile
            key={index}
            letter={letter}
            index={index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedIndex === index}
          />
        ))}
      </div>

      <button
        onClick={handleScramble}
        className="scramble-icon"
        aria-label="Scramble tiles"
        title="Scramble tiles"
      >
        <Shuffle size={18} />
      </button>
    </div>
  )
}
