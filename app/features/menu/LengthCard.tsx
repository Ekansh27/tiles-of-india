interface LengthCardProps {
  length: number
  count: number
  onClick: () => void
}

export function LengthCard({ length, count, onClick }: LengthCardProps) {
  return (
    <button onClick={onClick} className="length-card">
      <div className="length-number">
        {length} Letters
      </div>
      <div className="length-count">
        {count} words
      </div>
    </button>
  )
}
