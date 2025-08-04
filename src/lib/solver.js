// src/lib/solver.js
import wordsData from '../../words.json'

export const WORD_LEN = 5

/** 
 * Load the initial “possible” list from your JSON:
 * first try solutions, then validWords as fallback
 */
export function initialPossibleWords() {
  const sols = Array.isArray(wordsData.solutions)
    ? wordsData.solutions
    : []
  return sols.map(w => w.toUpperCase())
}
export function initialValidWords() {
  const valids = Array.isArray(wordsData.validWords)
    ? wordsData.validWords
    : []
  return valids.map(w => w.toUpperCase())
}

/**
 * Filters `possibleWords` given:
 *  - guess:    array of letters just guessed
 *  - corrects: array of same length, filled with green letters or ''
 *  - valids:   array of same length, filled with yellow letters or ''
 */
export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const cleanGuess  = guess.map(c => c.toUpperCase())
  const greens      = corrects.map(c => c.toUpperCase())
  const yellows     = valids.map(c => c.toUpperCase())

  // Build set of absent letters: those guessed but neither green nor yellow
  const absentSet = new Set(
    cleanGuess.filter((c,i) => !greens[i] && !yellows[i])
  )

  return possibleWords.filter(w => {
    // 1) Greens: must match exactly
    for (let i = 0; i < WORD_LEN; i++) {
      if (greens[i] && w[i] !== greens[i]) {
        return false
      }
    }
    // 2) Yellows: must include, but not in same slot
    for (let i = 0; i < WORD_LEN; i++) {
      if (yellows[i]) {
        if (!w.includes(yellows[i]))   return false
        if (w[i] === yellows[i])       return false
      }
    }
    // 3) Greys (absents): must not include at all
    for (const a of absentSet) {
      if (w.includes(a)) return false
    }
    return true
  })
}

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
    .sort((a,b) => b.score - a.score)
    .map(x => x.word)
}

export function getBestGuess(possibleWords) {
  return scoreWords(possibleWords)[0] || ''
}

export function getTopGuesses(possibleWords, count = 5) {
  return scoreWords(possibleWords).slice(0, count)
}
