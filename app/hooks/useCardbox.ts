import { useState, useEffect } from 'react'
import { CardboxData } from '../types'

const STORAGE_KEY = 'tilesOfIndiaCardbox'

export function useCardbox() {
  const [cardboxData, setCardboxData] = useState<CardboxData>({})

  // Load cardbox data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setCardboxData(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading cardbox data:', e)
      }
    }
  }, [])

  // Save cardbox data to localStorage
  const saveCardboxData = (data: CardboxData) => {
    setCardboxData(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // Update a specific anagram's box level
  const updateCardbox = (
    wordLength: number,
    anagramKey: string,
    foundAllAnagrams: boolean,
    clickedShowAnswer: boolean,
    accuracy: number
  ) => {
    const currentProgress = cardboxData[wordLength] || {}
    const currentBox = currentProgress[anagramKey] ?? 0

    console.log('Box Update:', {
      anagramKey,
      currentBox,
      foundAllAnagrams,
      clickedShowAnswer,
      accuracy: (accuracy * 100).toFixed(1) + '%'
    })

    let newBox: number

    if (clickedShowAnswer || !foundAllAnagrams) {
      // Move DOWN: Clicked "Show Answer" OR didn't find all anagrams
      newBox = Math.max(currentBox - 1, 0)
    } else if (accuracy === 1.0) {
      // Move UP: Got all anagrams with 100% accuracy
      newBox = Math.min(currentBox + 1, 5)
    } else if (accuracy >= 0.66) {
      // Stay: Got all anagrams with ≥66% accuracy
      newBox = currentBox
    } else {
      // Move DOWN: Got all anagrams with <66% accuracy
      newBox = Math.max(currentBox - 1, 0)
    }

    console.log('Box Movement:', { from: currentBox, to: newBox })

    const updatedProgress = {
      ...currentProgress,
      [anagramKey]: newBox
    }

    const updatedCardboxData = {
      ...cardboxData,
      [wordLength]: updatedProgress
    }

    saveCardboxData(updatedCardboxData)

    return { from: currentBox, to: newBox }
  }

  // Get box number for a specific anagram
  const getBoxNumber = (wordLength: number, anagramKey: string): number => {
    const progress = cardboxData[wordLength] || {}
    return progress[anagramKey] ?? 0
  }

  return {
    cardboxData,
    updateCardbox,
    getBoxNumber
  }
}
