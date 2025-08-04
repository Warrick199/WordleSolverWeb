// src/lib/solver.js
import wordsData from '../../words.json'

export const WORD_LEN = 5

// Load solution and valid-word lists from your JSON
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

// Initial “possible” = solutions
export function initialPossibleWords() {
  return solutionsList()
}

// Fallback list if solutions filter yields none
export function initialValidWords() {
  return validWordsList()
}

/**
 * Filter possibleWords given:
 *  - guess:    Array<string> of your last guess
 *  - corrects: Array<string> of greens (correct position) or ''
 *  - valids:   Array<string> of yellows (present but wrong position) or ''
 */
export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const greens  = corrects.map(c => c.toUpperCase())
  const yellows = valids.map(c => c.toUpperCase()).filter(c => c)

  return possibleWords.filter(w => {
    // 1) Greens: letter must match exactly at each green position
    for (let i = 0; i < WORD_LEN; i++) {
      if (greens[i] && w[i] !== greens[i]) {
        return false
      }
    }

    // 2) Yellows: each yellow letter must appear somewhere, but not at the same index
    for (let i = 0; i < WORD_LEN; i++) {
      if (yellows[i]) {
        if (!w.includes(yellows[i]))       return false
        if (w[i] === yellows[i])           return false
      }
    }

    // 3) All other letters unconstrained until explicitly marked
    return true
  })
}

/**
 * Score words by sum of letter‐frequency across the remaining pool.
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

// Top‐scoring single best guess
export function getBestGuess(possibleWords) {
  return scoreWords(possibleWords)[0] || ''
}

// Top N scoring guesses
export function getTopGuesses(possibleWords, count = 5) {
  return scoreWords(possibleWords).slice(0, count)
}
