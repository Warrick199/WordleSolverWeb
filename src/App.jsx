import { useState } from 'react'
import LetterRow from './components/LetterRow'
import Controls from './components/Controls'

export default function App() {
  // Each row holds 5 letters and their statuses
  const [rows, setRows] = useState([
    { letters: ['', '', '', '', ''], statuses: [] }
  ])

  const addRow = () =>
    setRows(r => [...r, { letters: ['', '', '', '', ''], statuses: [] }])

  const clearAll = () =>
    setRows([{ letters: ['', '', '', '', ''], statuses: [] }])

  const update = () => {
    // TODO: hook up your solver logic here
    console.log('Solving with rows:', rows)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Wordle Solver</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find my WORDLE. Stuck? Our solver can help!
        </p>
      </header>

      <main>
        {rows.map((r, i) => (
          <LetterRow key={i} letters={r.letters} statuses={r.statuses} />
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
