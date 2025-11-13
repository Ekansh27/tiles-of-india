'use client'

import { useGame } from '../../context/GameContext'
import { LengthCard } from './LengthCard'

export function MenuView() {
  const { lengthOptions, wordCounts, startGame } = useGame()

  return (
    <div className="game-container">
      <div className="panel glass-panel" style={{ maxWidth: '900px', margin: 'auto' }}>
        <h1 className="landing-title-small" style={{ marginBottom: '1.5rem', color: 'white' }}>
          Tiles of India
        </h1>

        <h2 className="section-title" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '3rem' }}>
          Choose word length
        </h2>

        <div className="length-grid">
          {lengthOptions.map(length => (
            <LengthCard
              key={length}
              length={length}
              count={wordCounts[length]}
              onClick={() => startGame(length)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
