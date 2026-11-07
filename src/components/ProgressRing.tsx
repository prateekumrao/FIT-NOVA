// Purpose: Circular progress indicator (SVG). `value` is 0-100.
export default function ProgressRing({ value, size = 96, label }: { value: number; size?: number; label?: string }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`${label ?? 'Progress'} ${Math.round(clamped)} percent`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#29352D" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#B7D8B8" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - clamped / 100)} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-bold">{Math.round(clamped)}%</span>
    </div>
  );
}
