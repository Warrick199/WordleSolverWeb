// src/App.jsx
import React, { useState } from 'react'
import Controls from './components/Controls'
import {
  initialPossibleWords,
  initialValidWords,
  filterPossibleWords,
  getBestGuess,
  getTopGuesses,
  WORD_LEN
} from './lib/solver'

export default function App() {
  // Seed & initial solver state
  const solutions    = initialPossibleWords()
  const validBank    = initialValidWords()
  const firstGuess   = getBestGuess(solutions).split('')
  const initialTop5  = getTopGuesses(solutions, 5).map(w => w.split(''))

  const [possibleWords,  setPossibleWords]   = useState(solutions)
  const [correctRows,     setCorrectRows]     = useState([Array(WORD_LEN).fill('')])
  const [validRows,       setValidRows]       = useState([Array(WORD_LEN).fill('')])
  const [guessRows,       setGuessRows]       = useState([firstGuess])
  const [nextBestGuesses, setNextBestGuesses] = useState(initialTop5)

  const activeRow = guessRows.length - 1
  const solved    = correctRows[activeRow].every(c => c !== '')

  // Handlers (unchanged) …
  const handleNextGuess = () => {
    if (solved) return
    const idx     = activeRow
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    let filtered = filterPossibleWords(possibleWords, guess, correct, valid)
    if (filtered.length === 0) {
      filtered = filterPossibleWords(validBank, guess, correct, valid)
    }
    setPossibleWords(filtered)

    const baseNext    = getBestGuess(filtered).split('')
    const seedCorrect = correctRows[idx]
    // carry-forward any green letters
    const seededNext  = baseNext.map((ltr,i) =>
      seedCorrect[i] ? seedCorrect[i] : ltr
    )
    const top5        = getTopGuesses(filtered, 5)

    setGuessRows(gr => [...gr, seededNext])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }
  const handleClearAll = () => { /* ... */ }
  const handleClearCurrentGuess = () => { /* ... */ }

  // renderDynamicGrid & renderReadOnlyGrid (unchanged) …

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        
        {/* ← Sticky Header & Controls */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 pb-4">
          <header className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Wordle Solver
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {solved
                ? `Well done! You solved it in ${guessRows.length} guesses 😊`
                : ''}
            </p>
          </header>
          <Controls
            onClearAll={handleClearAll}
            onNextGuess={handleNextGuess}
          />
        </div>

        {/* ← Now scrollable content starts here */}
        <section>
          <h2 className="mt-6 text-center font-bold text-gray-700 dark:text-gray-100 uppercase mb-2">
            GUESSES
          </h2>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleClearCurrentGuess}
              className="
                px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700
                text-gray-700 dark:text-gray-200 rounded-md
                hover:bg-gray-400 dark:hover:bg-gray-600 transition
              "
            >
              CLEAR CURRENT GUESS
            </button>
          </div>
          {renderDynamicGrid(guessRows, setGuessRows, 'bg-gray-300 dark:bg-gray-700')}
        </section>

        <section>
          <h2 className="mt-6 text-center font-bold text-green-600 uppercase mb-2">
            CORRECT LETTERS
          </h2>
          {renderDynamicGrid(correctRows, setCorrectRows, 'bg-green-500')}
        </section>

        <section>
          <h2 className="mt-6 text-center font-bold text-yellow-500 uppercase mb-2">
            VALID LETTERS
          </h2>
          {renderDynamicGrid(validRows, setValidRows, 'bg-yellow-500')}
        </section>

        <section>
          <h2 className="mt-6 text-center font-bold text-gray-900 dark:text-gray-100 uppercase mb-2">
            TOP FIVE GUESSES
          </h2>
          {renderReadOnlyGrid(nextBestGuesses)}
        </section>
      </div>
    </div>
  )
}
