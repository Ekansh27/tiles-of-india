'use client'

import { ThreeBackground } from './ThreeBackground'
import { useGame } from '../../context/GameContext'

export function LandingPage() {
  const { setView } = useGame()

  return (
    <div className="landing-container">
      <ThreeBackground />
      <div className="landing-content">
        <h1 className="landing-title">
          The Tiles of India
        </h1>
        <p className="landing-subtitle">
          A repository of <span className="indian-origin-gradient">indian-origin</span> words in Scrabble
        </p>
        <button onClick={() => setView('menu')} className="landing-button">
          Start Training <span>&rarr;</span>
        </button>
      </div>
    </div>
  )
}
