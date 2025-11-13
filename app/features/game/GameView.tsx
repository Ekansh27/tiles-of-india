'use client'

import { GameHeader } from './components/GameHeader'
import { TileGrid } from './components/TileGrid'
import { AnswerInput } from './components/AnswerInput'
import { FeedbackDisplay } from './components/FeedbackDisplay'
import { StatsBar } from './components/StatsBar'

export function GameView() {
  return (
    <div className="game-container">
      <div className="panel glass-panel game-panel">
        <GameHeader />
        <TileGrid />
        <AnswerInput />
        <FeedbackDisplay />
        <StatsBar />
      </div>
    </div>
  )
}
