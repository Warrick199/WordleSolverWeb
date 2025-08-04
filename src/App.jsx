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
  // 1) Load initial pools and first guess
  const solutions   = initialPossibleWords()
  const validWords  = initialValidWords()
  const firstGuess  = getBestGuess(solutions).split('')
  const firstTop5   = getTopGuesses(solutions, 5).map(w => w.split(''))

  // 2) State
  const [possibleWords, setPossibleWords] = useState(solutions)
  const [correctRows,     setCorrectRows]   = useState([Array(WORD_LEN).fill('')])
  const [validRows,       setValidRows]     = useState([Array(WORD_LEN).fill('')])
  const [guessRows,       setGuessRows]     = useState([firstGuess])
  const [nextBestGuesses, setNextBestGuesses] = useState(firstTop5)

  // 3) Next Guess handler
  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    // filter, with fallback to validWords if no solutions remain
    let filtered = filterPossibleWords(possibleWords, guess, correct, valid)
    if (filtered.length === 0) filtered = filterPossibleWords(validWords, guess, correct, valid)
    setPossibleWords(filtered)

    // compute next guess + top5
    const ng = getBestGuess(filtered).split('')
    const t5 = getTopGuesses(filtered, 5).map(w => w.split(''))

    // append rows
    setGuessRows(gr => [...gr, ng])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(t5)
  }

  // 4) Clear All = full page reload
  const handleClearAll = () => {
    window.location.reload()
  }

  // 5) Render editable grid (colours on entry)
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

  // 6) Render read-only Next Best Guesses
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
