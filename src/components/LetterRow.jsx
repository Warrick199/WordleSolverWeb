import React from 'react'
import LetterCell from './LetterCell'

export default function LetterRow({
  letters = [],
  statuses = []
}) {
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
