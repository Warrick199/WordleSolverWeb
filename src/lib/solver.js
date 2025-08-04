// src/lib/solver.js
import wordsData from '../../words.json'

export const WORD_LEN = 5

export function initialPossibleWords() {
  // Guard against different JSON shapes
  const list = Array.isArray(wordsData)
    ? wordsData
    : Array.isArray(wordsData.words)
      ? wordsData.words
      : []
  return list.map(w => w.toUpperCase())
}

export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const cleanGuess    = guess.map(c => c.toUpperCase())
  const cleanCorrects = corrects.map(c => c.toUpperCase())
  const cleanValids   = valids.map(c => c.toUpperCase()).filter(c => c)

  // letters in guess that are neither correct nor valid
  const absent = cleanGuess.filter(
    (c,i) => !cleanCorrects[i] && !cleanValids.includes(c)
  )
  const absentSet = new Set(absent)

  return possibleWords.filter(w => {
    // correct-position checks
    for (let i = 0; i < w.length; i++) {
      if (cleanCorrects[i] && w[i] !== cleanCorrects[i]) return false
    }
    // must include all valids
    for (const v of cleanValids) {
      if (!w.includes(v)) return false
    }
    // must exclude all absents
    for (const a of absentSet) {
      if (w.includes(a)) return false
    }
    return true
  })
}

export function scoreWords(possibleWords) {
  const freqs = {}
  for (const w of possibleWords) {
    for (const c of new Set(w)) {
      freqs[c] = (freqs[c] || 0) + 1
    }
  }
  return possibleWords
    .map(w => ({
      word:  w,
      score: Array.from(new Set(w))
               .reduce((sum, c) => sum + freqs[c], 0)
    }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.word)
}

export function getBestGuess(possibleWords) {
  const scored = scoreWords(possibleWords)
  return scored[0] || ''
}

export function getTopGuesses(possibleWords, count = 5) {
  return scoreWords(possibleWords).slice(0, count)
}
