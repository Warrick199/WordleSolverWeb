// src/lib/solver.js
import wordsData from '../../words.json'

export const WORD_LEN = 5

// Raw lists from your JSON
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
// Fallback list
export function initialValidWords() {
  return validWordsList()
}

export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const cleanGuess    = guess.map(c => c.toUpperCase())
  const cleanCorrects = corrects.map(c => c.toUpperCase())
  const cleanValids   = valids.map(c => c.toUpperCase()).filter(c => c)

  // letters neither correct nor valid
  const absentSet = new Set(
    cleanGuess.filter((c,i) =>
      !cleanCorrects[i] && !cleanValids.includes(c)
    )
  )

  return possibleWords.filter(w => {
    // 1) Greens: exact positions
    for (let i = 0; i < WORD_LEN; i++) {
      if (cleanCorrects[i] && w[i] !== cleanCorrects[i]) {
        return false
      }
    }
    // 2) Yellows: must include
    for (const v of cleanValids) {
      if (!w.includes(v)) return false
    }
    // 3) Greys: must exclude
    for (const a of absentSet) {
      if (w.includes(a)) return false
    }
    return true
  })
}

export function scoreWords(possibleWords) {
  const freqs = {}
  // tally freq of each letter across unique-letter words
  possibleWords.forEach(w => {
    new Set(w).forEach(c => {
      freqs[c] = (freqs[c]||0) + 1
    })
  })
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
  return scoreWords(possibleWords)[0]||''
}
export function getTopGuesses(possibleWords, count=5) {
  return scoreWords(possibleWords).slice(0,count)
}
