import React, { useState } from 'react'
import LetterRow  from './components/LetterRow'
import Controls   from './components/Controls'

export default function App() {
  const WORD_LEN = 5

  // Start with one row each
  const [correctRows, setCorrectRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [validRows, setValidRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [guessRows, setGuessRows] = useState([
    { letters: Array(WORD_LEN).fill(''), statuses: [] }
  ])

  // Add a new row to all three
  const addRow = () => {
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setGuessRows(gr => [
      ...gr,
      { letters: Array(WORD_LEN).fill(''), statuses: [] }
    ])
  }

  // Reset everything back to one blank row
  const clearAll = () => {
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setGuessRows([
      { letters: Array(WORD_LEN).fill(''), statuses: [] }
    ])
  }

  // Helper to render a grid of inputs
  const renderInputGrid = (rows, setRows, bgClass) =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => (
          <input
            key={colIdx}
            type="text"
            maxLength={1}
            value={ltr}
            onChange={e => {
              const next = rows.map(r => [...r])  // deep copy all rows
              next[rowIdx][colIdx] = e.target.value.toLowerCase()
              setRows(next)
            }}
            className={`
              ${bgClass} text-white w-12 h-12 mx-1 text-xl font-bold
              text-center rounded
            `}
          />
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

      {/* Correct Letters */}
      <h2 className="text-center font-semibold text-green-600 mb-2">
        Correct Letters
      </h2>
      {renderInputGrid(correctRows, setCorrectRows, 'bg-green-600')}

      {/* Valid Letters */}
      <h2 className="text-center font-semibold text-yellow-500 mb-2">
        Valid Letters
      </h2>
      {renderInputGrid(validRows, setValidRows, 'bg-yellow-500')}

      {/* Guesses */}
      <h2 className="text-center font-semibold text-gray-700 mb-2">
        Guesses
      </h2>
      {guessRows.map((r, i) => (
        <LetterRow
          key={i}
          letters={r.letters}
          statuses={r.statuses}
        />
      ))}

      {/* Controls */}
      <Controls
        onClearAll={clearAll}
        onNextGuess={addRow}
      />
    </div>
  )
}
