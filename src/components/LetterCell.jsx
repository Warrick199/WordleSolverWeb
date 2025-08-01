import React from 'react'

const STATUS_CLASSES = {
  correct: 'bg-green-600 text-white',
  present: 'bg-yellow-500 text-white',
  absent:  'bg-gray-500 text-white',
  empty:   'bg-gray-100 dark:bg-gray-800'
}

export default function LetterCell({ letter, status }) {
  return (
    <div
      className={`
        ${STATUS_CLASSES[status] || ''}
        w-12 h-12 mx-1 text-xl font-bold
        text-center flex items-center justify-center
        rounded
      `}
    >
      {letter || ''}
    </div>
  )
}
