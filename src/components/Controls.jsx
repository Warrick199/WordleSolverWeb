// src/components/Controls.jsx
import React, { useState } from 'react'

export default function Controls({ onNextGuess, onClearAll }) {
  // start light mode by default
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    if (!dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setDark(!dark)
  }

  return (
    <div className="flex justify-center items-center mt-4 mb-6 space-x-4">
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
