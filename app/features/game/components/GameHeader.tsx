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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <button
        onClick={handleBackToMenu}
        className="back-button"
      >
        <ArrowLeft size={20} /> Back to Menu
      </button>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          padding: '0.4rem 0.8rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          Word {currentAnagramGroupNumber}/{totalAnagramGroups}
        </div>

        <div style={{
          fontSize: '0.85rem',
          color: boxTransition ? '#10b981' : 'var(--text-secondary)',
          padding: '0.4rem 0.8rem',
          background: boxTransition ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
          borderRadius: '6px',
          border: boxTransition ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}>
          {boxTransition ? `Box ${boxTransition.from} → ${boxTransition.to}` : `Box ${currentBoxNumber}`}
        </div>
      </div>
    </div>
  )
}
