import { useState } from 'react'

export default function Controls({ onUpdate, onClearAll }) {
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    setDark(d => !d)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="mt-4 flex flex-col items-center space-y-3">
      <div className="flex space-x-4">
        <button 
          onClick={onClearAll}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Clear All
        </button>
        <button 
          onClick={onUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Update
        </button>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        {dark ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
