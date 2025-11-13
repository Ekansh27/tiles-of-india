'use client'

import { ArrowLeft } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Alert } from '../../components/Alert'

export function SessionComplete() {
  const { handleBackToMenu, sessionStats, totalAnagramGroups } = useGame()

  const totalAttempts = sessionStats.correct + sessionStats.incorrect
  const accuracy = totalAttempts > 0
    ? ((sessionStats.correct / totalAttempts) * 100).toFixed(1)
    : 0

  return (
    <div className="game-container">
      <div className="panel glass-panel" style={{ maxWidth: '600px', margin: 'auto' }}>
        <button
          onClick={handleBackToMenu}
          className="back-button"
        >
          <ArrowLeft size={20} /> Back to Menu
        </button>

        <h1 className="panel-title gradient-text">
          Tiles of India
        </h1>

        <Alert variant="success">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Session Complete!
          </h3>
          <div style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            color: '#10b981'
          }}>
            {sessionStats.correct}/{totalAnagramGroups}
          </div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            You got {sessionStats.correct} out of {totalAnagramGroups} word groups correct
          </p>
          <div className="stats-summary" style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <div>Correct: {sessionStats.correct}</div>
            <div>Incorrect: {sessionStats.incorrect}</div>
            <div style={{
              marginTop: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              Accuracy: {accuracy}%
            </div>
          </div>
          <button
            onClick={handleBackToMenu}
            className="action-button primary"
          >
            Back to Menu
          </button>
        </Alert>
      </div>
    </div>
  )
}
