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
  // 1) Load word lists & compute initial guesses
  const solutions   = initialPossibleWords()
  const validBank   = initialValidWords()
  const firstGuess  = getBestGuess(solutions).split('')
  const initialTop5 = getTopGuesses(solutions, 5).map(w => w.split(''))

  // 2) State
  const [possibleWords,  setPossibleWords]   = useState(solutions)
  const [correctRows,     setCorrectRows]     = useState([Array(WORD_LEN).fill('')])
  const [validRows,       setValidRows]       = useState([Array(WORD_LEN).fill('')])
  const [guessRows,       setGuessRows]       = useState([firstGuess])
  const [nextBestGuesses, setNextBestGuesses] = useState(initialTop5)

  // 3) Track active row & solved flag
  const activeRow = guessRows.length - 1
  const solved    = correctRows[activeRow].every(c => c !== '')

  // 4) Handlers
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
    setGuessRows([firstGuess])
    setNextBestGuesses(initialTop5)
  }

  const handleClearCurrentGuess = () => {
    setGuessRows(gr =>
      gr.map((row, i) => (i === activeRow ? Array(WORD_LEN).fill('') : row))
    )
  }

  // 5) Render editable grids with auto‐advance & backspace/delete navigation
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
            ? 'border-2 border-red-500 dark:border-red-500'
            : ''

          return (
            <input
              key={cIdx}
              type="text"
              maxLength={1}
              value={ltr}
              onKeyDown={e => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  e.preventDefault()
                  const copy = rows.map(r => [...r])
                  // clear current box
                  copy[rIdx][cIdx] = ''
                  setRows(copy)
                  // move focus to previous box
                  if (cIdx > 0) {
                    const prev = e.target.previousElementSibling
                    if (prev && prev.tagName === 'INPUT') prev.focus()
                  }
                }
              }}
              onChange={e => {
                const v    = e.target.value.toUpperCase()
                const copy = rows.map(r => [...r])
                copy[rIdx][cIdx] = v
                setRows(copy)
                // move focus to next
                const next = e.target.nextElementSibling
                if (next && next.tagName === 'INPUT') next.focus()
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

  // 6) Read-only Next Best Guesses
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

  // 7) Render
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {solved ? `Well done! You solved it in ${guessRows.length} guesses 😊` : ''}
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

      <h2 className="text-center font-semibold text-yellow-500 uppercase mb-6">
        Valid Letters
      </h2>
      {renderDynamicGrid(validRows, setValidRows, 'bg-yellow-500')}

      <h2 className="text-center font-semibold text-gray-700 uppercase mb-2">
        Guesses
      </h2>
      <div className="flex justify-center mb-2">
        <button
          onClick={handleClearCurrentGuess}
          className="px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded"
        >
          CLEAR CURRENT GUESS
        </button>
      </div>
      {renderDynamicGrid(guessRows, setGuessRows, 'bg-gray-100 dark:bg-gray-800')}

      <h2 className="text-center font-semibold text-blue-600 uppercase mb-2">
        Next Best Guesses
      </h2>
      {renderReadOnlyGrid(nextBestGuesses)}
    </div>
  )
}
