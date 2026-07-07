/**
 * The Poplar mark: one tree above a dashed horizon, roots below.
 * Inherits color via currentColor so it works on cream (nav) and soil (footer).
 * Bold strokes so it stays legible at 16–32px.
 */
export default function PoplarMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Poplar mark: a tree with roots below the ground line"
    >
      <line x1="24" y1="118" x2="176" y2="118" stroke="currentColor" strokeOpacity="0.45" strokeWidth="5" strokeDasharray="10 12" strokeLinecap="round" />
      <g stroke="currentColor" strokeWidth="12" strokeLinecap="round">
        <path d="M 100 118 L 100 30" />
        <path d="M 100 52 L 124 30" />
        <path d="M 100 74 L 78 52" />
        <path d="M 100 92 L 120 72" />
      </g>
      <g stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.8">
        <path d="M 100 118 C 100 138, 100 150, 100 162" />
        <path d="M 100 124 C 86 140, 68 148, 50 152" />
        <path d="M 100 124 C 114 140, 132 148, 150 152" />
      </g>
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.5">
        <path d="M 100 142 C 92 154, 82 161, 70 166" />
        <path d="M 100 142 C 108 154, 118 161, 130 166" />
      </g>
    </svg>
  );
}
