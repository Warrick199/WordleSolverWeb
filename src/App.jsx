import React, { useState } from 'react'
import Controls from './components/Controls'
import LetterRow from './components/LetterRow'

export default function App() {
  const WORD_LEN = 5
  const SUGGESTIONS_COUNT = 5

  const [correctRows, setCorrectRows] = useState([Array(WORD_LEN).fill('')])
  const [validRows,   setValidRows]   = useState([Array(WORD_LEN).fill('')])
  const [guessRows,   setGuessRows]   = useState([Array(WORD_LEN).fill('')])
  const [nextBestGuesses] = useState(
    () => Array.from({ length: SUGGESTIONS_COUNT }, () =>
      Array(WORD_LEN).fill('')
    )
  )

  const addRow = () => {
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(  vr => [...vr, Array(WORD_LEN).fill('')])
    setGuessRows(  gr => [...gr, Array(WORD_LEN).fill('')])
  }

  const clearAll = () => {
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows(  [Array(WORD_LEN).fill('')])
    setGuessRows(  [Array(WORD_LEN).fill('')])
  }

  // editable grids
  const renderInputGrid = (rows, setRows, fillColor) =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => {
          const isFilled = !!ltr
          const bgClass   = isFilled
            ? fillColor
            : 'bg-transparent dark:bg-transparent border border-gray-400 dark:border-gray-600'
          const textClass = isFilled
            ? 'text-white'
            : 'text-gray-900 dark:text-gray-100'

          return (
            <input
              key={colIdx}
              type="text"
              maxLength={1}
              value={ltr}
              onChange={e => {
                const v = e.target.value.toUpperCase()
                const copy = rows.map(r => [...r])
                copy[rowIdx][colIdx] = v
                setRows(copy)
              }}
              className={`
                ${bgClass} ${textClass}
                w-12 h-12 mx-1 text-xl font-bold uppercase
                text-center rounded
              `}
            />
          )
        })}
      </div>
    ))

  // read-only suggestions
  const renderReadOnlyGrid = rows =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => (
          <div
            key={colIdx}
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

      <Controls onClearAll={clearAll} onNextGuess={addRow} />

      <h2 className="text-center font-semibold text-green-600 mb-2">
        Correct Letters
      </h2>
      {renderInputGrid(correctRows, setCorrectRows, 'bg-green-600')}

      <h2 className="text-center font-semibold text-yellow-500 mb-2">
        Valid Letters
      </h2>
      {renderInputGrid(validRows, setValidRows, 'bg-yellow-500')}

      <h2 className="text-center font-semibold text-gray-700 mb-2">
        Guesses
      </h2>
      {renderInputGrid(
        guessRows,
        setGuessRows,
        'bg-gray-100 dark:bg-gray-800'
      )}

      <h2 className="text-center font-semibold text-blue-600 mb-2">
        Next Best Guesses
      </h2>
      {renderReadOnlyGrid(nextBestGuesses)}
    </div>
  )
}
