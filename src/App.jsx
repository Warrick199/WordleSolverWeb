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

  // React state
  const [possibleWords,   setPossibleWords]   = useState(solutions)
  const [correctRows,      setCorrectRows]     = useState([Array(WORD_LEN).fill('')])
  const [validRows,        setValidRows]       = useState([Array(WORD_LEN).fill('')])
  const [guessRows,        setGuessRows]       = useState([firstGuess])
  const [nextBestGuesses,  setNextBestGuesses] = useState(initialTop5)

  const activeRow = guessRows.length - 1
  const solved    = correctRows[activeRow].every(c => c !== '')

  // Handlers
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

    const baseNext   = getBestGuess(filtered).split('')
    const seededNext = baseNext.map((ltr, i) => (correct[i] ? correct[i] : ltr))
    const top5       = getTopGuesses(filtered, 5)

    setGuessRows(gr => [...gr, seededNext])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }

  const handleClearAll = () => {
    setPossibleWords(solutions)
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([firstGuess])
    setNextBestGuesses(initialTop5)
  }

  const handleClearCurrentGuess = () => {
    setGuessRows(gr => gr.map((row, i) => (i === activeRow ? Array(WORD_LEN).fill('') : row)))
  }

  // Editable grid (supports auto-fill on focus for correct/valid)
  const renderDynamicGrid = (rows, setRows, fillColor, role) =>
    rows.map((letters, rIdx) => (
      <div key={rIdx} className="flex justify-center my-2">
        {letters.map((ltr, cIdx) => {
          const filled  = !!ltr
          const bgClass = filled
            ? fillColor
            : 'bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-600'
          const isGuessGrid = fillColor.includes('gray-')
          const txtCls  = isGuessGrid
            ? 'text-gray-900 dark:text-gray-100'
            : filled
              ? 'text-white'
              : 'text-gray-900 dark:text-gray-100'
          const highlight = rIdx === activeRow ? 'ring-2 ring-red-500' : ''

          return (
            <input
              key={cIdx}
              type="text"
              maxLength={1}
              value={ltr}
              onFocus={() => {
                if ((role === 'correct' || role === 'valid') && rIdx === activeRow) {
                  const fromGuess = guessRows[activeRow]?.[cIdx] || ''
                  if (fromGuess && !letters[cIdx]) {
                    const copy = rows.map(r => [...r])
                    copy[rIdx][cIdx] = fromGuess.toUpperCase()
                    setRows(copy)
                  }
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  e.preventDefault()
                  const copy = rows.map(r => [...r])
                  copy[rIdx][cIdx] = ''
                  setRows(copy)
                  if (cIdx > 0) e.target.previousElementSibling?.focus()
                }
              }}
              onChange={e => {
                const v    = e.target.value.toUpperCase()
                const copy = rows.map(r => [...r])
                copy[rIdx][cIdx] = v
                setRows(copy)
                e.target.nextElementSibling?.focus()
              }}
              className={`${bgClass} ${txtCls} ${highlight}
                w-12 h-12 mx-1 text-lg font-semibold uppercase
                text-center rounded-md shadow-sm transition`}
            />
          )
        })}
      </div>
    ))

  const renderReadOnlyGrid = rows =>
    rows.map((letters, rIdx) => (
      <div key={rIdx} className="flex justify-center my-2">
        {letters.map((ltr, cIdx) => (
          <div
            key={cIdx}
            className="bg-gray-300 dark:bg-gray-700
                       w-12 h-12 mx-1 flex items-center justify-center
                       text-lg font-semibold uppercase text-gray-900 dark:text-gray-100
                       rounded-md shadow-sm transition"
          >
            {ltr}
          </div>
        ))}
      </div>
    ))

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Sticky Header — tighter padding & no empty message gap */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 pt-1 pb-1">
        <header className="text-center mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Wordle Solver
          </h1>
          {/* Only render the message when solved to avoid extra vertical space */}
          {solved && (
            <p className="mt-0.5 text-gray-500 dark:text-gray-400 text-sm">
              {`Well done! You solved it in ${guessRows.length} guesses 😊`}
            </p>
          )}
        </header>

        {/* Buttons row with reduced margins/spacing lives in Controls.jsx */}
        <Controls onClearAll={handleClearAll} onNextGuess={handleNextGuess} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Guesses */}
        <section>
          <h2 className="mt-6 text-center font-bold text-gray-700 dark:text-gray-100 uppercase mb-2">
            GUESSES
          </h2>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleClearCurrentGuess}
              className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700
                         text-gray-700 dark:text-gray-200 rounded-md
                         hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              CLEAR CURRENT GUESS
            </button>
          </div>
          {renderDynamicGrid(guessRows, setGuessRows, 'bg-gray-300 dark:bg-gray-700', 'guess')}
        </section>

        {/* Correct Letters */}
        <section>
          <h2 className="mt-6 text-center font-bold text-green-600 uppercase mb-2">
            CORRECT LETTERS
          </h2>
          {renderDynamicGrid(correctRows, setCorrectRows, 'bg-green-500', 'correct')}
        </section>

        {/* Valid Letters */}
        <section>
          <h2 className="mt-6 text-center font-bold text-yellow-500 uppercase mb-2">
            VALID LETTERS
          </h2>
          {renderDynamicGrid(validRows, setValidRows, 'bg-yellow-500', 'valid')}
        </section>

        {/* Top Five Guesses */}
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
