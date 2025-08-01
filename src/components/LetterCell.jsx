export default function LetterCell({ letter, status }) {
  const statusClasses = {
    correct: 'bg-green-600 text-white',
    present: 'bg-yellow-500 text-white',
    absent:  'bg-gray-500 text-white',
    empty:   'bg-gray-100 dark:bg-gray-800'
  }
  return (
    <div
      className={
        `w-12 h-12 md:w-14 md:h-14 mx-1
         flex items-center justify-center
         font-bold text-lg rounded ${statusClasses[status]}`
      }
    >
      {letter || ''}
    </div>
  )
}
