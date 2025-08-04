import React, { useState, useEffect } from 'react'

export default function Controls({ onNextGuess, onClearAll }) {
  // start in light until we read the stored value
  const [dark, setDark] = useState(false)

  // on mount, read the saved theme and apply it
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored === 'dark'
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="flex justify-center items-center mt-4 mb-8 space-x-4">
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
