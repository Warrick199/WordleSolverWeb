import React, { useState } from 'react'
import Controls from './components/Controls'
import LetterRow from './components/LetterRow'
import {
  initialPossibleWords,
  filterPossibleWords,
  getBestGuess,
  getTopGuesses,
  WORD_LEN
} from './lib/solver'

export default function App() {
  const [possibleWords, setPossibleWords] = useState(
    initialPossibleWords()
  )

  const [correctRows, setCorrectRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [validRows, setValidRows] = useState([
    Array(WORD_LEN).fill('')
  ])
  const [guessRows, setGuessRows] = useState([
    getBestGuess(possibleWords).split('')
  ])
  const [nextBestGuesses, setNextBestGuesses] = useState(
    getTopGuesses(possibleWords, 5).map(w => w.split(''))
  )

  const handleNextGuess = () => {
    const idx     = guessRows.length - 1
    const guess   = guessRows[idx]
    const correct = correctRows[idx]
    const valid   = validRows[idx]

    const filtered = filterPossibleWords(
      possibleWords,
      guess,
      correct,
      valid
    )
    setPossibleWords(filtered)

    const nextWord = getBestGuess(filtered)
    const top5     = getTopGuesses(filtered, 5)

    setGuessRows(gr => [...gr, nextWord.split('')])
    setCorrectRows(cr => [...cr, Array(WORD_LEN).fill('')])
    setValidRows(vr => [...vr, Array(WORD_LEN).fill('')])
    setNextBestGuesses(top5.map(w => w.split('')))
  }

  const handleClearAll = () => {
    const initial = initialPossibleWords()
    const first   = getBestGuess(initial).split('')

    setPossibleWords(initial)
    setGuessRows([first])
    setCorrectRows([Array(WORD_LEN).fill('')])
    setValidRows([Array(WORD_LEN).fill('')])
    setNextBestGuesses(
      getTopGuesses(initial, 5).map(w => w.split(''))
    )
  }

  const renderInputGrid = (
    rows, setRows, bgClass, textClass = 'text-white'
  ) =>
    rows.map((letters, rowIdx) => (
      <div key={rowIdx} className="flex justify-center my-2">
        {letters.map((ltr, colIdx) => (
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
        ))}
      </div>
    ))

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

      <Controls
        onClearAll={handleClearAll}
        onNextGuess={handleNextGuess}
      />

      <h2 className="text-center font-semibold text-green-600 uppercase mb-2">
        Correct Letters
      </h2>
      {renderInputGrid(
        correctRows, setCorrectRows, 'bg-green-600'
      )}

      <h2 className="text-center font-semibold text-yellow-500 uppercase mb-2">
        Valid Letters
      </h2>
      {renderInputGrid(
        validRows, setValidRows, 'bg-yellow-500'
      )}

      <h2 className="text-center font-semibold text-gray-700 uppercase mb-2">
        Guesses
      </h2>
      {renderInputGrid(
        guessRows,
        setGuessRows,
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-900 dark:text-gray-100'
      )}

      <h2 className="text-center font-semibold text-blue-600 uppercase mb-2">
        Next Best Guesses
      </h2>
      {renderReadOnlyGrid(nextBestGuesses)}
    </div>
  )
}
