import React from 'react'
import LetterCell from './LetterCell'

export default function LetterRow({
  letters = [],      // default to an empty array
  statuses = []      // default to an empty array
}) {
  // Ensure we’re working with arrays
  const safeLetters  = Array.isArray(letters)  ? letters  : []
  const safeStatuses = Array.isArray(statuses) ? statuses : []

  return (
    <div className="flex justify-center my-2">
      {safeLetters.map((ltr, i) => (
        <LetterCell
          key={i}
          letter={ltr}
          status={safeStatuses[i] || 'empty'}
        />
      ))}
    </div>
  )
}
