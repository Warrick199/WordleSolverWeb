import React, { useState } from 'react'
import GroupInput from './components/GroupInput'
import LetterRow from './components/LetterRow'
import Controls from './components/Controls'

export default function App() {
  const WORD_LEN = 5
  const VALID_SLOTS = 6

  const [correctLetters, setCorrectLetters] = useState(
    Array(WORD_LEN).fill('')
  )
  const [validLetters, setValidLetters] = useState(
    Array(VALID_SLOTS).fill('')
  )
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
    setValidLetters(Array(VALID_SLOTS).fill(''))
    setRows([{ letters: Array(WORD_LEN).fill(''), statuses: [] }])
  }

  const update = () => {
    // TODO: implement your solver logic here
    console.log('Solving with:', {
      correctLetters,
      validLetters,
      rows
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find my WORDLE. Stuck? Our solver can help!
        </p>
      </header>

      {/* Input groups */}
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

      <GroupInput
        title="Valid Letters"
        color="yellow"
        letters={validLetters}
        onLetterChange={(i, v) => {
          const next = [...validLetters]
          next[i] = v.toLowerCase()
          setValidLetters(next)
        }}
        onClear={() => setValidLetters(Array(VALID_SLOTS).fill(''))}
      />

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
