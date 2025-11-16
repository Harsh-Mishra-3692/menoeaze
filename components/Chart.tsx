// TODO: Replace with Chart.js or similar library
export default function Chart({ data }: { data: { date: string; value: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const width = 100;
  const height = 200;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#gradient)"
          points={areaPoints}
        />
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          points={points}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" />
            <stop offset="100%" stopColor="rgb(236, 72, 153)" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
          const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="rgb(147, 51, 234)"
              className="hover:r-5 transition-all"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
        {data.map((d, i) => (
          <span key={i} className="truncate max-w-[60px]">
            {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  );
}

