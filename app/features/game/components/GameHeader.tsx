'use client'

import { ArrowLeft } from 'lucide-react'
import { useGame } from '../../../context/GameContext'

export function GameHeader() {
  const {
    handleBackToMenu,
    currentAnagramGroupNumber,
    totalAnagramGroups,
    boxTransition,
    currentBoxNumber
  } = useGame()

  return (
    <div className="game-header">
      <button
        onClick={handleBackToMenu}
        className="back-button"
      >
        <ArrowLeft size={20} /> Back to Menu
      </button>

      <div className="game-stats">
        <div className="stat-badge" style={{
          color: 'var(--text-secondary)',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          Word {currentAnagramGroupNumber}/{totalAnagramGroups}
        </div>

        <div className="stat-badge" style={{
          color: boxTransition
            ? boxTransition.to > boxTransition.from
              ? '#10b981'  // Green for moving up
              : boxTransition.to < boxTransition.from
                ? '#ef4444'  // Red for moving down
                : '#eab308'  // Yellow for staying
            : 'var(--text-secondary)',
          background: boxTransition
            ? boxTransition.to > boxTransition.from
              ? 'rgba(16, 185, 129, 0.1)'  // Green background for up
              : boxTransition.to < boxTransition.from
                ? 'rgba(239, 68, 68, 0.1)'  // Red background for down
                : 'rgba(234, 179, 8, 0.1)'  // Yellow background for staying
            : 'rgba(255,255,255,0.05)',
          border: boxTransition
            ? boxTransition.to > boxTransition.from
              ? '1px solid rgba(16, 185, 129, 0.3)'  // Green border for up
              : boxTransition.to < boxTransition.from
                ? '1px solid rgba(239, 68, 68, 0.3)'  // Red border for down
                : '1px solid rgba(234, 179, 8, 0.3)'  // Yellow border for staying
            : '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}>
          {boxTransition ? `Box ${boxTransition.from} → ${boxTransition.to}` : `Box ${currentBoxNumber}`}
        </div>
      </div>
    </div>
  )
}
