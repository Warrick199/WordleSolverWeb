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
  // Seed data
  const solutions    = initialPossibleWords()
  const validBank    = initialValidWords()
  const FIRST_GUESS  = 'CRANE'.split('')
  const INITIAL_TOP5 = getTopGuesses(solutions, 5).map(w => w.split(''))

  // State
  const [possibleWords, setPossibleWords]       = useState(solutions)
  const [correctRows,    setCorrectRows]         = useState([Array(WORD_LEN).fill('')])
  const [validRows,      setValidRows]           = useState([Array(WORD_LEN).fill('')])
  const [guessRows,      setGuessRows]           = useState([FIRST_GUESS])
  const [nextBestGuesses, setNextBestGuesses]    = useState(INITIAL_TOP5)

  // Handlers
  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    let filtered = filterPossibleWords(possibleWords, guess, correct, valid)
    if (filtered.length === 0) {
      filtered = filterPossibleWords(validBank, guess, correct, valid)
    }
    setPossibleWords(filtered)

    const ng = getBestGuess(filtered).split('')
    const t5 = getTopGuesses(filtered, 5).map(w => w.split(''))

    setGuessRows(gr => [...gr, ng])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(t5)
  }

  const handleClearAll = () => {
    setPossibleWords(solutions)
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([FIRST_GUESS])
    setNextBestGuesses(INITIAL_TOP5)
  }

  // Determine which row is active
  const activeRow = guessRows.length - 1

  // Renders editable grids (Correct, Valid, Guesses) with red border on active row
  const renderDynamicGrid = (rows, setRows, fillColor) =>
    rows.map((letters, rIdx) => (
      <div key={rIdx} className="flex justify-center my-2">
        {letters.map((ltr, cIdx) => {
          const filled     = !!ltr
          const bgClass    = filled
            ? fillColor
            : 'bg-transparent dark:bg-transparent border border-gray-400 dark:border-gray-600'
          const isGuessGrid = fillColor.includes('gray-100')
          const txtCls     = isGuessGrid
            ? 'text-gray-900 dark:text-gray-100'
            : filled
              ? 'text-white'
              : 'text-gray-900 dark:text-gray-100'
          const highlight  = rIdx === activeRow
            ? 'border-2 border-red-500'
            : ''

          return (
            <input
              key={cIdx}
              type="text"
              maxLength={1}
              value={ltr}
              onChange={e => {
                const v    = e.target.value.toUpperCase()
                const copy = rows.map(r => [...r])
                copy[rIdx][cIdx] = v
                setRows(copy)
              }}
              className={`
                ${bgClass} ${txtCls} ${highlight}
                w-12 h-12 mx-1 text-xl font-bold uppercase
                text-center rounded
              `}
            />
          )
        })}
      </div>
    ))

  // Read-only Next Best Guesses
  const renderReadOnlyGrid = rows =>
    rows.map((letters, rIdx) => (
      <div key={rIdx} className="flex justify-center my-2">
        {letters.map((ltr, cIdx) => (
          <div
            key={cIdx}
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
        <p className="text-gray-600 dark:text-gray-400">Messages Here</p>
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
