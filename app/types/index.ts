export interface Word {
  word: string
  definition: string
  length: number
}

export interface FeedbackState {
  type: 'correct' | 'incorrect' | 'valid-not-indian' | 'show-answer' | 'all-done'
  word?: string
  definition?: string
  userWord?: string
  allWords?: Word[]
  totalWords?: number
}

export interface SessionStats {
  correct: number
  incorrect: number
  wordsReviewed: Set<string>
}

export interface CardboxProgress {
  [anagramKey: string]: number // anagram key (sorted letters) -> box number (0-4)
}

export interface CardboxData {
  [length: number]: CardboxProgress // word length -> progress
}

export interface BoxTransition {
  from: number
  to: number
}

export type ViewType = 'landing' | 'menu' | 'game'
