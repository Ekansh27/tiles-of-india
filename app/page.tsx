'use client'

import { GameProvider, useGame } from './context/GameContext'
import { LandingPage } from './features/landing/LandingPage'
import { MenuView } from './features/menu/MenuView'
import { GameView } from './features/game/GameView'
import { SessionComplete } from './features/game/SessionComplete'

function AppContent() {
  const { view, loading, feedback } = useGame()

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-overlay">
          <div className="spinner" />
          <h1>Loading words...</h1>
        </div>
      </div>
    )
  }

  if (feedback && feedback.type === 'all-done') {
    return (
      <div className="app-container">
        <SessionComplete />
      </div>
    )
  }

  return (
    <div className="app-container">
      {view === 'landing' && <LandingPage />}
      {view === 'menu' && <MenuView />}
      {view === 'game' && <GameView />}
    </div>
  )
}

export default function TilesOfIndia() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
