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
  // Initialise solver state
  const initialWords    = initialPossibleWords()
  const firstGuess      = getBestGuess(initialWords)
  const initialTop5     = getTopGuesses(initialWords, 5)

  const [possibleWords, setPossibleWords] = useState(initialWords)
  const [correctRows,    setCorrectRows]   = useState([Array(WORD_LEN).fill('')])
  const [validRows,      setValidRows]     = useState([Array(WORD_LEN).fill('')])
  const [guessRows,      setGuessRows]     = useState([firstGuess.split('')])
  const [nextBestGuesses,setNextBestGuesses] = useState(
    initialTop5.map(w => w.split(''))
  )

  // Advance to next guess
  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    // Filter possibilities
    const filtered = filterPossibleWords(
      possibleWords,
      guess,
      correct,
      valid
    )
    setPossibleWords(filtered)

    // Compute next suggestion
    const newGuess = getBestGuess(filtered)
    const top5     = getTopGuesses(filtered, 5)

    // Append rows
    setGuessRows(gr => [...gr, newGuess.split('')])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }

  // Reset everything
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

  // Renders a grid where cells only get colored when filled
  const renderDynamicGrid = (rows, setRows, fillColor) =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => {
          const isFilled = !!ltr
          const bgClass  = isFilled
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
                const v    = e.target.value.toUpperCase()
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

  // Read-only 5×5 grid for suggestions
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

      {/* Controls */}
      <Controls onClearAll={handleClearAll} onNextGuess={handleNextGuess} />

      {/* Correct Letters */}
      <h2 className="text-center font-semibold text-green-600 uppercase mb-2">
        Correct Letters
      </h2>
      {renderDynamicGrid(correctRows, setCorrectRows, 'bg-green-600')}

      {/* Valid Letters */}
      <h2 className="text-center font-semibold text-yellow-500 uppercase mb-2">
        Valid Letters
      </h2>
      {renderDynamicGrid(validRows, setValidRows, 'bg-yellow-500')}

      {/* Guesses */}
      <h2 className="text-center font-semibold text-gray-700 uppercase mb-2">
        Guesses
      </h2>
      {renderDynamicGrid(guessRows, setGuessRows, 'bg-gray-100 dark:bg-gray-800')}

      {/* Next Best Guesses */}
      <h2 className="text-center font-semibold text-blue-600 uppercase mb-2">
        Next Best Guesses
      </h2>
      {renderReadOnlyGrid(nextBestGuesses)}
    </div>
  )
}
