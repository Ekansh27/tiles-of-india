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

  // Select words: 9 from box 0, 4 from box 1, 3 from box 2, 2 from box 3, 1 from box 4, 1 from box 5
  const distribution = [9, 4, 3, 2, 1, 1]
  const selectedGroups: Word[][] = []

  for (let boxNum = 0; boxNum < 6; boxNum++) {
    const shuffledBox = shuffleArray(boxes[boxNum])
    const needed = distribution[boxNum]
    const taken = shuffledBox.slice(0, needed)
    selectedGroups.push(...taken)

    // If we didn't get enough from this box, pull extras from box 0
    if (taken.length < needed && boxNum > 0) {
      const shortage = needed - taken.length
      const extras = shuffleArray(boxes[0]).slice(0, shortage)
      selectedGroups.push(...extras)
    }
  }

  // Shuffle the final selection
  return shuffleArray(selectedGroups)
}
