// src/App.jsx
import React, { useState } from 'react'
import Controls from './components/Controls'
import {
  initialPossibleWords,
  filterPossibleWords,
  getBestGuess,
  getTopGuesses,
  WORD_LEN
} from './lib/solver'

export default function App() {
  // initialise solver
  const allWords   = initialPossibleWords()
  const firstGuess = getBestGuess(allWords)
  const top5Start  = getTopGuesses(allWords, 5)

  const [possibleWords, setPossibleWords] = useState(allWords)
  const [correctRows,     setCorrectRows]   = useState([Array(WORD_LEN).fill('')])
  const [validRows,       setValidRows]     = useState([Array(WORD_LEN).fill('')])
  const [guessRows,       setGuessRows]     = useState([firstGuess.split('')])
  const [nextBestGuesses, setNextBestGuesses] = useState(
    top5Start.map(w => w.split(''))
  )

  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    const filtered = filterPossibleWords(possibleWords, guess, correct, valid)
    setPossibleWords(filtered)

    const newGuess = getBestGuess(filtered)
    const top5     = getTopGuesses(filtered, 5)

    setGuessRows(gr => [...gr, newGuess.split('')])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }

  const handleClearAll = () => {
    const fresh   = initialPossibleWords()
    const fg      = getBestGuess(fresh)
    const t5      = getTopGuesses(fresh, 5)
    setPossibleWords(fresh)
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([fg.split('')])
    setNextBestGuesses(t5.map(w => w.split('')))
  }

  // renders editable grid, colouring only when letters are entered
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

  // render read-only Next Best Guesses
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find my WORDLE. Stuck? Our solver can help!
        </p>
      </header>

      <Controls onClearAll={handleClearAll} onNextGuess={handleNextGuess} />

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
