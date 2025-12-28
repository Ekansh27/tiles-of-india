'use client'

import { useRef, useEffect } from 'react'
import { useGame } from '../../../context/GameContext'

export function AnswerInput() {
  const {
    userAnswer,
    setUserAnswer,
    feedback,
    currentWordSet,
    selectedLength,
    handleCheck,
    handleShowAnswer,
    handleNextWord
  } = useGame()

  const inputRef = useRef<HTMLInputElement>(null)

  // Refocus input after feedback or next word
  useEffect(() => {
    if (feedback?.type === 'correct' || feedback?.type === 'incorrect' || feedback?.type === 'valid-not-indian') {
      // Small delay to allow feedback to render, then refocus
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [feedback])

  // Focus input when new word loads
  useEffect(() => {
    if (currentWordSet && currentWordSet.length > 0 && !feedback) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [currentWordSet, feedback])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (feedback?.type === 'show-answer' || !currentWordSet || currentWordSet.length === 0) {
        handleNextWord()
      } else if (userAnswer.length > 0) {
        handleCheck()
      } else {
        handleShowAnswer()
      }
    }
  }

  const handleNextClick = () => {
    handleNextWord()
    // Focus will be triggered by the useEffect when currentWordSet changes
  }

  const isReadOnly = feedback?.type === 'show-answer' || !currentWordSet || currentWordSet.length === 0

  return (
    <div className="answer-row">
      <input
        ref={inputRef}
        type="text"
        value={userAnswer}
        onChange={(e) => {
          if (!isReadOnly) {
            setUserAnswer(e.target.value)
          }
        }}
        placeholder="Type your answer"
        readOnly={isReadOnly}
        maxLength={selectedLength || 8}
        className={`answer-input small ${
          feedback?.type === 'correct' ? 'correct' : ''
        } ${
          feedback?.type === 'incorrect' || feedback?.type === 'valid-not-indian' ? 'warning' : ''
        }`}
        onKeyDown={handleKeyDown}
      />

      {(feedback?.type === 'show-answer' || (currentWordSet && currentWordSet.length === 0)) && (
        <button
          onClick={handleNextClick}
          className="action-button success inline-next"
        >
          Next Word &rarr;
        </button>
      )}
    </div>
  )
}
