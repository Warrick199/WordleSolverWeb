import React, { useState } from 'react'

export default function Controls({ onNextGuess, onClearAll }) {
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    setDark(d => !d)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex justify-center items-center mt-4 space-x-4">
      <button
        onClick={onClearAll}
        className="px-4 py-2 bg-gray-700 text-white rounded"
      >
        Clear All
      </button>
      <button
        onClick={onNextGuess}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next Guess
      </button>
      <button
        onClick={toggleTheme}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        {dark ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
