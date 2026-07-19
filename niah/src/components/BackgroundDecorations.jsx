function rng(seed) {
  let s = seed
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s)
    s ^= s + Math.imul(s ^ (s >>> 7), 61 | s)
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296
  }
}

const COLORS = [
  ['#f9a8c9', '#f4c2d4'],
  ['#a8d8ea', '#c4e8f4'],
  ['#b8e0b8', '#cceacc'],
  ['#f7d08a', '#fce0a8'],
  ['#c3aed6', '#d4c4e8'],
  ['#f4a261', '#f7bc8a'],
  ['#8daa91', '#a8c4ac'],
  ['#e8c4b8', '#f0d4cc'],
]

function generateFlowers(count = 60) {
  const rand = rng(0xcafebabe)
  return Array.from({ length: count }, () => {
    const colorPair = COLORS[Math.floor(rand() * COLORS.length)]
    return {
      x:          rand() * 100,
      y:          rand() * 100,
      size:       18 + rand() * 80,
      rotation:   rand() * 360,
      opacity:    0.25 + rand() * 0.45,
      petals:     Array.from({ length: 5 }, (_, p) => p % 2 === 0 ? colorPair[0] : colorPair[1]),
      petalColor: colorPair[0],
    }
  })
}

const FLOWERS = generateFlowers(60)

function Flower({ x, y, size, rotation, opacity, petals, petalColor }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position:      'absolute',
        left:          `${x}%`,
        top:           `${y}%`,
        opacity,
        pointerEvents: 'none',
        overflow:      'visible',
        transform:     `rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      {petals.map((color, i) => (
        <ellipse
          key={i}
          cx={50} cy={28}
          rx={12} ry={24}
          fill={color}
          transform={`rotate(${(i * 360) / 5} 50 50)`}
        />
      ))}
      <circle cx={50} cy={50} r={12} fill="#fff"       opacity={0.9} />
      <circle cx={50} cy={50} r={7}  fill={petalColor} opacity={0.5} />
    </svg>
  )
}

export default function BackgroundDecorations() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {FLOWERS.map((f, i) => <Flower key={i} {...f} />)}
    </div>
  )
}