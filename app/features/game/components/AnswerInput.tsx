'use client'

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

  const isReadOnly = feedback?.type === 'show-answer' || !currentWordSet || currentWordSet.length === 0

  return (
    <div className="answer-row">
      <input
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
          onClick={handleNextWord}
          className="action-button success inline-next"
        >
          Next Word &rarr;
        </button>
      )}
    </div>
  )
}
