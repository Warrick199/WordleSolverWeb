import React from 'react'

const STATUS_CLASSES = {
  green: 'bg-green-600 text-white',
  yellow: 'bg-yellow-500 text-white',
  gray:   'bg-gray-500 text-white'
}

const TITLE_CLASSES = {
  green: 'text-green-600',
  yellow: 'text-yellow-500',
  gray:   'text-gray-600'
}

export default function GroupInput({
  title,
  color = 'gray',
  letters = [],
  onLetterChange = () => {},
  onClear = () => {}
}) {
  return (
    <section className="my-6">
      {/* Centre the title, keep Clear on the right */}
      <div className="flex justify-center items-center mb-2 relative">
        <h2 className={`font-semibold ${TITLE_CLASSES[color]}`}>{title}</h2>
        <button
          onClick={onClear}
          className="absolute right-0 text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>

      {/* Centre the inputs */}
      <div className="flex justify-center">
        {Array.isArray(letters)
          ? letters.map((ltr, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={ltr}
                onChange={e => onLetterChange(i, e.target.value)}
                className={`
                  ${STATUS_CLASSES[color] || ''}
                  w-12 h-12 mx-1 text-xl font-bold
                  text-center rounded
                `}
              />
            ))
          : null}
      </div>
    </section>
  )
}
