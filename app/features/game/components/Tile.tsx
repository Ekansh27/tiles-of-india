interface TileProps {
  letter: string
  index: number
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
  isDragging: boolean
}

export function Tile({
  letter,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}: TileProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      className={`tile-animated ${isDragging ? 'dragging' : ''}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        cursor: 'grab'
      }}
    >
      {letter}
    </div>
  )
}
