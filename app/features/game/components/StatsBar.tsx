'use client'

import { useGame } from '../../../context/GameContext'

export function StatsBar() {
  const { sessionStats } = useGame()

  const totalAttempts = sessionStats.correct + sessionStats.incorrect
  const accuracy = totalAttempts > 0
    ? ((sessionStats.correct / totalAttempts) * 100).toFixed(0)
    : 0

  return (
    <div className="stats-bar">
      This Session: Correct: {sessionStats.correct} • Incorrect: {sessionStats.incorrect}
      {totalAttempts > 0 && (
        <> • Accuracy: {accuracy}%</>
      )}
    </div>
  )
}
