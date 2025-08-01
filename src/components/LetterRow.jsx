import LetterCell from './LetterCell'

export default function LetterRow({ letters, statuses }) {
  return (
    <div className="flex justify-center my-2">
      {letters.map((ltr, i) => (
        <LetterCell key={i} letter={ltr} status={statuses[i] || 'empty'} />
      ))}
    </div>
  )
}
