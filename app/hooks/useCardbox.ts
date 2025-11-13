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
    foundAll: boolean
  ) => {
    const currentProgress = cardboxData[wordLength] || {}
    const currentBox = currentProgress[anagramKey] ?? 0

    let newBox: number
    if (foundAll) {
      // Move up (max box 5)
      newBox = Math.min(currentBox + 1, 5)
    } else {
      // Move down (min box 0)
      newBox = Math.max(currentBox - 1, 0)
    }

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
