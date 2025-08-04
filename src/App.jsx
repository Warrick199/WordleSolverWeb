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
  // 1) Seed lists & first guess
  const solutions   = initialPossibleWords()
  const validWords  = initialValidWords()
  const FIRST_GUESS = 'CRANE'.split('')

  // 2) React state
  const [possibleWords, setPossibleWords] = useState(solutions)
  const [correctRows,    setCorrectRows]    = useState([Array(WORD_LEN).fill('')])
  const [validRows,      setValidRows]      = useState([Array(WORD_LEN).fill('')])
  const [guessRows,      setGuessRows]      = useState([FIRST_GUESS])
  const [nextBestGuesses, setNextBestGuesses] = useState([
    FIRST_GUESS,
    Array(WORD_LEN).fill(''),
    Array(WORD_LEN).fill(''),
    Array(WORD_LEN).fill(''),
    Array(WORD_LEN).fill('')
  ])

  // 3) Handler: Next Guess
  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    // a) filter against solutions list or fallback
    let filtered = filterPossibleWords(possibleWords, guess, correct, valid)
    if (filtered.length === 0) {
      filtered = filterPossibleWords(validWords, guess, correct, valid)
    }
    setPossibleWords(filtered)

    // b) compute next guess + top5
    const nextWord = getBestGuess(filtered)
    const top5     = getTopGuesses(filtered, 5)

    // c) append rows
    setGuessRows(gr => [...gr, nextWord.split('')])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }

  // 4) Handler: Clear All
  const handleClearAll = () => {
    const fg   = getBestGuess(solutions)
    const t5   = getTopGuesses(solutions, 5)

    setPossibleWords(solutions)
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([fg.split('')])
    setNextBestGuesses(t5.map(w => w.split('')))
  }

  // 5) Render a grid where cells colour only when filled
  const renderDynamicGrid = (rows, setRows, fillColor) =>
    rows.map((letters, r) => (
      <div key={r} className="flex justify-center my-2">
        {letters.map((ltr, c) => {
          const filled  = !!ltr
          const bgClass = filled
            ? fillColor
            : 'bg-transparent dark:bg-transparent border border-gray-400 dark:border-gray-600'
          const txtCls  = filled
            ? 'text-white'
            : 'text-gray-900 dark:text-gray-100'

          return (
            <input
              key={c}
              type="text"
              maxLength={1}
              value={ltr}
              onChange={e => {
                const v    = e.target.value.toUpperCase()
                const copy = rows.map(r => [...r])
                copy[r][c] = v
                setRows(copy)
              }}
              className={`
                ${bgClass} ${txtCls}
                w-12 h-12 mx-1 text-xl font-bold uppercase
                text-center rounded
              `}
            />
          )
        })}
      </div>
    ))

  // 6) Read-only Next Best Guesses grid
  const renderReadOnlyGrid = rows =>
    rows.map((letters, r) => (
      <div key={r} className="flex justify-center my-2">
        {letters.map((ltr, c) => (
          <div
            key={c}
            className="
              bg-blue-600 text-white
              w-12 h-12 mx-1 text-xl font-bold uppercase
              flex items-center justify-center rounded
            "
          >
            {ltr || ''}
          </div>
        ))}
      </div>
    ))

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find my WORDLE. Stuck? Our solver can help!
        </p>
      </header>

      <Controls
        onClearAll={handleClearAll}
        onNextGuess={handleNextGuess}
      />

      <h2 className="text-center font-semibold text-green-600 uppercase mb-2">
        Correct Letters
      </h2>
      {renderDynamicGrid(correctRows, setCorrectRows, 'bg-green-600')}

      <h2 className="text-center font-semibold text-yellow-500 uppercase mb-2">
        Valid Letters
      </h2>
      {renderDynamicGrid(validRows, setValidRows, 'bg-yellow-500')}

      <h2 className="text-center font-semibold text-gray-700 uppercase mb-2">
        Guesses
      </h2>
      {renderDynamicGrid(guessRows, setGuessRows, 'bg-gray-100 dark:bg-gray-800')}

      <h2 className="text-center font-semibold text-blue-600 uppercase mb-2">
        Next Best Guesses
      </h2>
      {renderReadOnlyGrid(nextBestGuesses)}
    </div>
  )
}
