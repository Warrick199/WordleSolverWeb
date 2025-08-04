// src/lib/solver.js
import wordsData from '../../words.json'

export const WORD_LEN = 5

// Load your solutions and validWords lists
export function solutionsList() {
  return Array.isArray(wordsData.solutions)
    ? wordsData.solutions.map(w => w.toUpperCase())
    : []
}

export function validWordsList() {
  return Array.isArray(wordsData.validWords)
    ? wordsData.validWords.map(w => w.toUpperCase())
    : []
}

// Initial pools
export function initialPossibleWords() {
  return solutionsList()
}
export function initialValidWords() {
  return validWordsList()
}

/**
 * Filter possibleWords given:
 *   guess:    Array<string> (last guess)
 *   corrects: Array<string> of greens (correct position) or ''
 *   valids:   Array<string> of yellows (present but wrong position) or ''
 */
export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const guessArr   = guess.map(c => c.toUpperCase())
  const greensArr  = corrects.map(c => c.toUpperCase())
  const yellowsArr = valids.map(c => c.toUpperCase())

  // Grey letters: guessed letters neither green nor yellow
  const greySet = new Set(
    guessArr.filter((c,i) => c && greensArr[i] !== c && yellowsArr[i] !== c)
  )

  return possibleWords.filter(w => {
    // 1) Greens: exact matches
    for (let i = 0; i < WORD_LEN; i++) {
      if (greensArr[i] && w[i] !== greensArr[i]) {
        return false
      }
    }

    // 2) Yellows: must include, but not at the same index
    for (let i = 0; i < WORD_LEN; i++) {
      const y = yellowsArr[i]
      if (y) {
        if (!w.includes(y)) return false
        if (w[i] === y)     return false
      }
    }

    // 3) Greys: must exclude entirely
    for (const g of greySet) {
      if (w.includes(g)) return false
    }

    return true
  })
}

/**
 * Score words by letter-frequency in the remaining pool.
 * Returns an array of words sorted descending by score.
 */
export function scoreWords(possibleWords) {
  const freqs = {}
  possibleWords.forEach(w =>
    new Set(w).forEach(c =>
      freqs[c] = (freqs[c] || 0) + 1
    )
  )
  return possibleWords
    .map(w => ({
      word:  w,
      score: Array.from(new Set(w))
                   .reduce((sum, c) => sum + freqs[c], 0)
    }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.word)
}

// Top-scoring best guess
export function getBestGuess(possibleWords) {
  return scoreWords(possibleWords)[0] || ''
}

// Top N scoring guesses
export function getTopGuesses(possibleWords, count = 5) {
  return scoreWords(possibleWords).slice(0, count)
}
