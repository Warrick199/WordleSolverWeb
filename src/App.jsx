import React, { useState } from 'react'
import GroupInput from './components/GroupInput'
import LetterRow  from './components/LetterRow'
import Controls   from './components/Controls'

export default function App() {
  const WORD_LEN = 5

  // exactly 5 slots for both groups
  const [correctLetters, setCorrectLetters] = useState(
    Array(WORD_LEN).fill('')
  )
  const [validLetters, setValidLetters] = useState(
    Array(WORD_LEN).fill('')
  )

  // your guess rows
  const [rows, setRows] = useState([
    { letters: Array(WORD_LEN).fill(''), statuses: [] }
  ])

  const addRow = () =>
    setRows(prev => [
      ...prev,
      { letters: Array(WORD_LEN).fill(''), statuses: [] }
    ])

  const clearAll = () => {
    setCorrectLetters(Array(WORD_LEN).fill(''))
    setValidLetters(Array(WORD_LEN).fill(''))
    setRows([{ letters: Array(WORD_LEN).fill(''), statuses: [] }])
  }

  const update = () => {
    // TODO: your solver logic
    console.log({ correctLetters, validLetters, rows })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find my WORDLE. Stuck? Our solver can help!
        </p>
      </header>

      {/* Correct Letters */}
      <GroupInput
        title="Correct Letters"
        color="green"
        letters={correctLetters}
        onLetterChange={(i, v) => {
          const next = [...correctLetters]
          next[i] = v.toLowerCase()
          setCorrectLetters(next)
        }}
        onClear={() => setCorrectLetters(Array(WORD_LEN).fill(''))}
      />

      {/* Valid Letters */}
      <GroupInput
        title="Valid Letters"
        color="yellow"
        letters={validLetters}
        onLetterChange={(i, v) => {
          const next = [...validLetters]
          next[i] = v.toLowerCase()
          setValidLetters(next)
        }}
        onClear={() => setValidLetters(Array(WORD_LEN).fill(''))}
      />

      {/* Guesses title */}
      <h2 className="text-center font-semibold text-gray-700 mb-2">Guesses</h2>

      {/* Guess rows */}
      <main>
        {rows.map((r, idx) => (
          <LetterRow
            key={idx}
            letters={r.letters}
            statuses={r.statuses}
          />
        ))}

        <div className="text-center my-4">
          <button
            onClick={addRow}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add Row
          </button>
        </div>
      </main>

      <Controls onUpdate={update} onClearAll={clearAll} />
    </div>
  )
}
