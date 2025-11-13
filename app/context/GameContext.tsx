'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { Word, FeedbackState, SessionStats, ViewType, BoxTransition } from '../types'
import { useCardbox } from '../hooks/useCardbox'
import { createWordQueue, shuffleArray } from '../hooks/useWordQueue'

interface GameContextType {
  // View state
  view: ViewType
  setView: (view: ViewType) => void

  // Word data
  allWords: Word[]
  allValidWords: Set<string>
  loading: boolean
  wordCounts: Record<number, number>
  lengthOptions: number[]

  // Game state
  selectedLength: number | null
  currentWordSet: Word[] | null
  shuffledLetters: string[]
  userAnswer: string
  setUserAnswer: (answer: string) => void
  feedback: FeedbackState | null
  sessionStats: SessionStats
  foundWords: Word[]
  groupMarkedIncorrect: boolean
  boxTransition: BoxTransition | null
  totalAnagramGroups: number
  currentAnagramGroupNumber: number
  currentBoxNumber: number

  // Drag and drop state
  draggedIndex: number | null
  setDraggedIndex: (index: number | null) => void

  // Actions
  startGame: (length: number) => void
  handleScramble: () => void
  handleDragStart: (index: number) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (dropIndex: number) => void
  handleCheck: () => void
  handleShowAnswer: () => void
  handleNextWord: () => void
  handleBackToMenu: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  // View state
  const [view, setView] = useState<ViewType>('landing')

  // Word data
  const [allWords, setAllWords] = useState<Word[]>([])
  const [allValidWords, setAllValidWords] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Game state
  const [selectedLength, setSelectedLength] = useState<number | null>(null)
  const [currentWordSet, setCurrentWordSet] = useState<Word[] | null>(null)
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    correct: 0,
    incorrect: 0,
    wordsReviewed: new Set()
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordQueue, setWordQueue] = useState<Word[][]>([])
  const [foundWords, setFoundWords] = useState<Word[]>([])
  const [groupMarkedIncorrect, setGroupMarkedIncorrect] = useState(false)
  const [boxTransition, setBoxTransition] = useState<BoxTransition | null>(null)
  const [totalAnagramGroups, setTotalAnagramGroups] = useState(0)
  const [currentAnagramGroupNumber, setCurrentAnagramGroupNumber] = useState(1)
  const [currentBoxNumber, setCurrentBoxNumber] = useState<number>(0)

  // Cardbox hook
  const { cardboxData, updateCardbox, getBoxNumber } = useCardbox()

  // Load words
  useEffect(() => {
    const timestamp = new Date().getTime()
    Promise.all([
      fetch(`/indian_words.txt?v=${timestamp}`).then(r => r.text()),
      fetch(`/all_words.txt?v=${timestamp}`).then(r => r.text())
    ]).then(([indianData, allData]) => {
      // Parse Indian words
      const lines = indianData.split('\n').filter(line => line.trim())
      const words: Word[] = lines.map(line => {
        const [word, definition] = line.split('\t')
        return {
          word: word?.trim(),
          definition: definition?.trim(),
          length: word?.trim().length
        }
      }).filter(w => w.word && w.definition)
      setAllWords(words)

      // Parse all valid Scrabble words
      const allWordsSet = new Set(
        allData.split('\n')
          .map(line => line.split('\t')[0]?.trim())
          .filter(w => w)
      )
      setAllValidWords(allWordsSet)

      setLoading(false)
    }).catch(err => {
      console.error('Error loading words:', err)
      setLoading(false)
    })
  }, [])

  const wordCounts = useMemo(() => {
    const counts: Record<number, number> = {}
    allWords.forEach(w => {
      counts[w.length] = (counts[w.length] || 0) + 1
    })
    return counts
  }, [allWords])

  const lengthOptions = useMemo(() => {
    return [3, 4, 5, 6, 7, 8].filter(len => wordCounts[len] > 0)
  }, [wordCounts])

  // Actions
  const startGame = (length: number) => {
    const wordGroups = createWordQueue(allWords, length, cardboxData)

    if (wordGroups.length === 0) {
      alert(`No words available for ${length}-letter words.`)
      return
    }

    setSelectedLength(length)
    setWordQueue(wordGroups)
    setCurrentWordIndex(0)
    setView('game')
    setSessionStats({ correct: 0, incorrect: 0, wordsReviewed: new Set() })
    setTotalAnagramGroups(wordGroups.length)
    setCurrentAnagramGroupNumber(1)

    // Load first group
    const firstGroup = wordGroups[0]
    const firstGroupKey = firstGroup[0].word.split('').sort().join('')
    const firstBoxNumber = getBoxNumber(length, firstGroupKey)
    setCurrentBoxNumber(firstBoxNumber)
    setCurrentWordSet(firstGroup)
    setShuffledLetters(shuffleArray(firstGroup[0].word.split('')))
    setUserAnswer('')
    setFeedback(null)
    setFoundWords([])
    setGroupMarkedIncorrect(false)
  }

  const loadWordFromQueue = (index: number) => {
    if (index >= wordQueue.length) {
      setFeedback({
        type: 'all-done',
        totalWords: sessionStats.wordsReviewed.size
      })
      setCurrentWordSet(null)
      return
    }

    const group = wordQueue[index]
    const sortedLetters = group[0].word.split('').sort().join('')

    // Update box number for display
    if (selectedLength) {
      const boxNumber = getBoxNumber(selectedLength, sortedLetters)
      setCurrentBoxNumber(boxNumber)
    }

    setCurrentWordSet(group)
    setShuffledLetters(shuffleArray(group[0].word.split('')))
    setUserAnswer('')
    setFeedback(null)
    setFoundWords([])
    setGroupMarkedIncorrect(false)
    setBoxTransition(null)
  }

  const handleScramble = () => {
    setShuffledLetters(shuffleArray([...shuffledLetters]))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newLetters = [...shuffledLetters]
    const [draggedLetter] = newLetters.splice(draggedIndex, 1)
    newLetters.splice(dropIndex, 0, draggedLetter)

    setShuffledLetters(newLetters)
    setDraggedIndex(null)
  }

  const handleCheck = () => {
    if (!currentWordSet) return

    const answer = userAnswer.toUpperCase()
    const matchedWord = currentWordSet.find(w => w.word === answer)

    if (matchedWord) {
      // Correct answer
      const remaining = currentWordSet.filter(w => w.word !== matchedWord.word)
      const newFoundWords = [...foundWords, matchedWord]

      // Only increment "Correct" if ALL anagrams are now found
      if (remaining.length === 0 && !groupMarkedIncorrect) {
        setSessionStats(prev => ({
          ...prev,
          correct: prev.correct + 1,
          wordsReviewed: new Set([...prev.wordsReviewed, matchedWord.word])
        }))

        // Show box transition
        const newBox = Math.min(currentBoxNumber + 1, 5)
        setBoxTransition({ from: currentBoxNumber, to: newBox })
      } else {
        setSessionStats(prev => ({
          ...prev,
          wordsReviewed: new Set([...prev.wordsReviewed, matchedWord.word])
        }))
      }

      setCurrentWordSet(remaining)
      setFoundWords(newFoundWords)

      setFeedback({
        type: 'correct',
        word: matchedWord.word,
        definition: matchedWord.definition,
        allWords: remaining.length > 0 ? remaining : undefined
      })

      setUserAnswer('')
    } else if (allValidWords.has(answer) && answer.length === currentWordSet[0].word.length) {
      setFeedback({
        type: 'valid-not-indian',
        userWord: answer
      })
    } else {
      // Incorrect answer
      if (!groupMarkedIncorrect) {
        setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
        setGroupMarkedIncorrect(true)
      }
      setFeedback({ type: 'incorrect' })
    }
  }

  const handleShowAnswer = () => {
    if (currentWordSet) {
      currentWordSet.forEach(w => {
        setSessionStats(prev => ({
          ...prev,
          wordsReviewed: new Set([...prev.wordsReviewed, w.word])
        }))
      })

      const foundWordsSet = new Set(foundWords.map(w => w.word))
      const remainingUnique = currentWordSet.filter(w => !foundWordsSet.has(w.word))
      const allAnagrams = [...foundWords, ...remainingUnique]

      setFeedback({
        type: 'show-answer',
        word: allAnagrams[0]?.word,
        definition: allAnagrams[0]?.definition,
        allWords: allAnagrams.length > 1 ? allAnagrams : undefined
      })
    }

    if (!groupMarkedIncorrect) {
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
      setGroupMarkedIncorrect(true)
    }
  }

  const handleNextWord = () => {
    const referenceWord = currentWordSet?.[0] || foundWords[0]
    const currentSorted = referenceWord?.word.split('').sort().join('')

    const totalAnagrams = foundWords.length + (currentWordSet?.length || 0)
    const foundAll = foundWords.length === totalAnagrams && feedback?.type !== 'show-answer'

    // Update cardbox
    if (currentSorted && selectedLength) {
      updateCardbox(selectedLength, currentSorted, foundAll)
    }

    const nextIndex = currentWordIndex + 1
    setCurrentWordIndex(nextIndex)

    if (nextIndex < wordQueue.length) {
      setCurrentAnagramGroupNumber(prev => prev + 1)
    }

    loadWordFromQueue(nextIndex)
  }

  const handleBackToMenu = () => {
    setView('menu')
    setSelectedLength(null)
    setCurrentWordSet(null)
    setFeedback(null)
  }

  return (
    <GameContext.Provider value={{
      view,
      setView,
      allWords,
      allValidWords,
      loading,
      wordCounts,
      lengthOptions,
      selectedLength,
      currentWordSet,
      shuffledLetters,
      userAnswer,
      setUserAnswer,
      feedback,
      sessionStats,
      foundWords,
      groupMarkedIncorrect,
      boxTransition,
      totalAnagramGroups,
      currentAnagramGroupNumber,
      currentBoxNumber,
      draggedIndex,
      setDraggedIndex,
      startGame,
      handleScramble,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleCheck,
      handleShowAnswer,
      handleNextWord,
      handleBackToMenu
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
