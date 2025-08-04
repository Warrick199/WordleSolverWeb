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
      {/* Clear All */}
      <button
        onClick={onClearAll}
        className="
          h-8 px-4 text-sm uppercase
          bg-gray-300 dark:bg-gray-700
          text-gray-700 dark:text-gray-200
          rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
          transition
        "
      >
        CLEAR ALL
      </button>

      {/* Next Guess */}
      <button
        onClick={onNextGuess}
        className="
          h-8 px-4 text-sm uppercase
          bg-gray-300 dark:bg-gray-700
          text-gray-700 dark:text-gray-200
          rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
          transition
        "
      >
        NEXT GUESS
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="
          h-8 w-8 uppercase
          bg-gray-300 dark:bg-gray-700
          text-gray-700 dark:text-gray-200
          rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600
          transition flex items-center justify-center
        "
      >
        {dark ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
