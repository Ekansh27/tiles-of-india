'use client'

import { useGame } from '../../../context/GameContext'
import { Word } from '../../../types'

export function FeedbackDisplay() {
  const { feedback, foundWords, currentWordSet, handleCheck, handleShowAnswer, userAnswer } = useGame()

  return (
    <>
      {/* Inline feedback for correct answers */}
      {feedback && feedback.type === 'correct' && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          color: 'var(--text-primary)'
        }}>
          {foundWords.map((w, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: idx < foundWords.length - 1 ? '0.5rem' : 0
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{w.word}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{w.definition}</div>
            </div>
          ))}
          {currentWordSet && currentWordSet.length > 0 && (
            <div style={{
              fontSize: '0.9rem',
              color: '#228B22',
              fontWeight: '700',
              marginTop: foundWords.length > 0 ? '0.5rem' : 0,
              textAlign: 'center'
            }}>
              +{currentWordSet.length} more
            </div>
          )}
        </div>
      )}

      {/* Inline feedback for showing answer */}
      {feedback && feedback.type === 'show-answer' && feedback.allWords && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          color: 'var(--text-primary)'
        }}>
          {feedback.allWords.map((w: Word, idx: number) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: idx < feedback.allWords!.length - 1 ? '0.5rem' : 0
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{w.word}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{w.definition}</div>
            </div>
          ))}
        </div>
      )}

      {feedback && feedback.type === 'show-answer' && !feedback.allWords && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{feedback.word}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{feedback.definition}</div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        marginTop: '1.5rem'
      }}>
        {currentWordSet && currentWordSet.length > 0 && feedback?.type !== 'show-answer' && (
          <>
            <button
              onClick={handleCheck}
              disabled={userAnswer.length === 0}
              style={{
                background: 'none',
                border: 'none',
                color: userAnswer.length === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
                fontSize: '0.95rem',
                cursor: userAnswer.length === 0 ? 'not-allowed' : 'pointer',
                opacity: userAnswer.length === 0 ? 0.5 : 1,
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                padding: '0.5rem'
              }}
            >
              Check Answer
            </button>
            <button
              onClick={handleShowAnswer}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                padding: '0.5rem'
              }}
            >
              Show Answer
            </button>
          </>
        )}
      </div>

      {/* Error messages */}
      {feedback && feedback.type === 'incorrect' && (
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#ef4444',
          fontSize: '0.95rem'
        }}>
          Incorrect - try again!
        </div>
      )}

      {feedback && feedback.type === 'valid-not-indian' && (
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#eab308',
          fontSize: '0.95rem'
        }}>
          <strong>{feedback.userWord}</strong> is valid, but not the Indian word!
        </div>
      )}
    </>
  )
}
