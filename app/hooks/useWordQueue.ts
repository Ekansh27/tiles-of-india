import { Word, CardboxData } from '../types'

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function createWordQueue(
  allWords: Word[],
  length: number,
  cardboxData: CardboxData
): Word[][] {
  // Get all words of this length
  const wordsOfLength = allWords.filter(w => w.length === length)

  if (wordsOfLength.length === 0) {
    return []
  }

  // Group by anagrams to avoid duplicates
  const anagramGroupsMap = new Map<string, Word[]>()
  const processed = new Set<string>()

  wordsOfLength.forEach(word => {
    if (processed.has(word.word)) return

    const sortedLetters = word.word.split('').sort().join('')
    const anagrams = wordsOfLength.filter(w => {
      const sorted = w.word.split('').sort().join('')
      return sorted === sortedLetters
    })

    anagrams.forEach(w => processed.add(w.word))
    anagramGroupsMap.set(sortedLetters, anagrams)
  })

  // Get cardbox progress for this length
  const progress = cardboxData[length] || {}

  // Organize groups into boxes (0-5)
  const boxes: Word[][][] = [[], [], [], [], [], []]

  anagramGroupsMap.forEach((group, sortedKey) => {
    const boxNumber = progress[sortedKey] ?? 0 // Default to box 0 for new words
    boxes[boxNumber].push(group)
  })

  // Select words: 7 from box 0, 4 from box 1, 4 from box 2, 3 from box 3, 1 from box 4, 1 from box 5
  const distribution = [7, 4, 4, 3, 1, 1]
  const selectedGroups: Word[][] = []
  const buriedAnagramKeys = new Set<string>() // Track anagram families to avoid

  // Helper to check if an anagram key is too similar to already selected ones
  const isTooSimilar = (anagramKey: string): boolean => {
    // Get the base pattern (without trailing 'S')
    const baseKey = anagramKey.endsWith('S') ? anagramKey.slice(0, -1) : anagramKey

    // Check if we've already selected this base or its plural
    if (buriedAnagramKeys.has(baseKey) || buriedAnagramKeys.has(baseKey + 'S')) {
      return true
    }

    return false
  }

  for (let boxNum = 0; boxNum < 6; boxNum++) {
    const shuffledBox = shuffleArray(boxes[boxNum])
    const needed = distribution[boxNum]
    const taken: Word[][] = []

    // Filter out similar words and take what we need
    for (const group of shuffledBox) {
      if (taken.length >= needed) break

      const anagramKey = group[0].word.split('').sort().join('')

      if (!isTooSimilar(anagramKey)) {
        taken.push(group)
        buriedAnagramKeys.add(anagramKey)
      }
    }

    selectedGroups.push(...taken)

    // If we didn't get enough from this box, pull extras from box 0
    if (taken.length < needed && boxNum > 0) {
      const shortage = needed - taken.length
      const shuffledBox0 = shuffleArray(boxes[0])
      const extras: Word[][] = []

      for (const group of shuffledBox0) {
        if (extras.length >= shortage) break

        const anagramKey = group[0].word.split('').sort().join('')

        if (!isTooSimilar(anagramKey)) {
          extras.push(group)
          buriedAnagramKeys.add(anagramKey)
        }
      }

      selectedGroups.push(...extras)
    }
  }

  // Shuffle the final selection
  return shuffleArray(selectedGroups)
}
