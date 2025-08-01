import React from 'react'

const STATUS_CLASSES = {
  green: 'bg-green-600 text-white',
  yellow: 'bg-yellow-500 text-white',
  gray:   'bg-gray-500 text-white'
}

export default function GroupInput({
  console.log('🟢 GroupInput letters prop:', letters);
  if (!Array.isArray(letters)) {
  console.error('🔴 Expected letters to be an array but got:', letters);
  return null; // bail out early
  }
  title,
  color,           // 'green' | 'yellow' | 'gray'
  letters,         // array of strings
  onLetterChange,  // (index, newLetter) => void
  onClear          // () => void
}) {
  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className={`font-semibold text-${color}-600`}>{title}</h2>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>

      <div className="flex">
        {letters.map
          ? letters.map((ltr, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={ltr}
            onChange={e => onLetterChange(i, e.target.value)}
            className={`
              ${STATUS_CLASSES[color]}
              w-12 h-12 mx-1 text-xl font-bold
              text-center rounded
            `}
          />
        ))
        : null
        }
      </div>
    </section>
  )
}
