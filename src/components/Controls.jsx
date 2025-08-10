// src/components/Controls.jsx
import React, { useState, useEffect } from 'react'

export default function Controls({ onNextGuess, onClearAll }) {
  // Persist theme across reloads
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored === 'dark'
    setDark(isDark)
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <div className="flex justify-center items-center mt-1 mb-2 space-x-2">
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

      {/* Theme Toggle (square, aligned height) */}
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
