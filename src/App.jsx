import React, { useState } from 'react'
import Controls from './components/Controls'

export default function App() {
  const WORD_LEN = 5

  // Three synchronized grids of rows
  const [correctRows, setCorrectRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [validRows, setValidRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [guessRows, setGuessRows] = useState([
    Array(WORD_LEN).fill('')
  ])

  // Add one blank row to all three grids
  const addRow = () => {
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr   => [...vr, Array(WORD_LEN).fill('')])
    setGuessRows(gr   => [...gr, Array(WORD_LEN).fill('')])
  }

  // Reset all grids back to one blank row
  const clearAll = () => {
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([Array(WORD_LEN).fill('')])
  }

  // Helper to render an input grid
  const renderInputGrid = (rows, setRows, bgClass, textClass = 'text-white') =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => (
          <input
            key={colIdx}
            type="text"
            maxLength={1}
            value={ltr}
            onChange={e => {
              const v = e.target.value.toUpperCase()
              const next = rows.map(r => [...r]) // deep-copy
              next[rowIdx][colIdx] = v
              setRows(next)
            }}
            className={`
              ${bgClass} ${textClass}
              w-12 h-12 mx-1 text-xl font-bold uppercase
              text-center rounded
            `}
          />
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

      {/* Correct Letters */}
      <h2 className="text-center font-semibold text-green-600 mb-2">
        Correct Letters
      </h2>
      {renderInputGrid(
        correctRows,
        setCorrectRows,
        'bg-green-600'
      )}

      {/* Valid Letters */}
      <h2 className="text-center font-semibold text-yellow-500 mb-2">
        Valid Letters
      </h2>
      {renderInputGrid(
        validRows,
        setValidRows,
        'bg-yellow-500'
      )}

      {/* Guesses */}
      <h2 className="text-center font-semibold text-gray-700 mb-2">
        Guesses
      </h2>
      {renderInputGrid(
        guessRows,
        setGuessRows,
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-900 dark:text-gray-100'
      )}

      {/* Controls */}
      <Controls
        onClearAll={clearAll}
        onNextGuess={addRow}
      />
    </div>
  )
}
