import words from '../../words.json'  // adjust path if your words.json is elsewhere

export const WORD_LEN = 5

export function initialPossibleWords() {
  return words.map(w => w.toUpperCase())
}

export function filterPossibleWords(possibleWords, guess, corrects, valids) {
  const cleanGuess    = guess.map(c => c.toUpperCase())
  const cleanCorrects = corrects.map(c => c.toUpperCase())
  const cleanValids   = valids
    .map(c => c.toUpperCase())
    .filter(c => c)

  const absentCandidates = cleanGuess.filter(
    (c,i) => !cleanCorrects[i] && !cleanValids.includes(c)
  )
  const absentSet = new Set(absentCandidates)

  return possibleWords.filter(w => {
    // correct positions
    for (let i = 0; i < w.length; i++) {
      if (cleanCorrects[i] && w[i] !== cleanCorrects[i]) return false
    }
    // must contain all valids
    for (const v of cleanValids) {
      if (!w.includes(v)) return false
    }
    // must not contain any absents
    for (const a of absentSet) {
      if (w.includes(a)) return false
    }
    return true
  })
}

export function scoreWords(possibleWords) {
  const freqs = {}
  for (const w of possibleWords) {
    for (const c of Array.from(new Set(w))) {
      freqs[c] = (freqs[c] || 0) + 1
    }
  }
  return possibleWords
    .map(w => ({
      word: w,
      score: Array.from(new Set(w))
        .reduce((sum, c) => sum + freqs[c], 0)
    }))
    .sort((a,b) => b.score - a.score)
    .map(x => x.word)
}

export function getBestGuess(possibleWords) {
  const scored = scoreWords(possibleWords)
  return scored[0] || ''
}

export function getTopGuesses(possibleWords, count = 5) {
  return scoreWords(possibleWords).slice(0, count)
}
