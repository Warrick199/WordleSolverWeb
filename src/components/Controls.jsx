// src/components/Controls.jsx
import React, { useState } from 'react'

export default function Controls({ onNextGuess, onClearAll }) {
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
    <div className="flex justify-center items-center mt-4 mb-8 space-x-4">
      <button
        onClick={onClearAll}
        className="px-6 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
      >
        Clear All
      </button>
      <button
        onClick={onNextGuess}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
      >
        Next Guess
      </button>
      <button
        onClick={toggleTheme}
        className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {dark ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
