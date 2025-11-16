// Enhanced chart with normal levels (green) and user levels (blue)
export default function EnhancedChart({ 
  data, 
  normalLevel = 5 
}: { 
  data: { date: string; value: number }[];
  normalLevel?: number;
}) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), normalLevel, 10);
  const width = 100;
  const height = 200;
  const padding = 20;

  // User data points
  const userPoints = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Normal level line (green)
  const normalY = height - padding - (normalLevel / maxValue) * (height - 2 * padding);
  const normalLine = `${padding},${normalY} ${width - padding},${normalY}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        <defs>
          <linearGradient id="userGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="normalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Normal level area */}
        <rect
          x={padding}
          y={normalY}
          width={width - 2 * padding}
          height={height - padding - normalY}
          fill="url(#normalGradient)"
        />
        
        {/* User data area */}
        {data.length > 0 && (
          <polygon
            fill="url(#userGradient)"
            points={`${userPoints} ${width - padding},${height - padding} ${padding},${height - padding}`}
          />
        )}

        {/* Normal level line (green) */}
        <line
          x1={padding}
          y1={normalY}
          x2={width - padding}
          y2={normalY}
          stroke="rgb(34, 197, 94)"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.8"
        />

        {/* User data line (blue) */}
        <polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          points={userPoints}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
          const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="rgb(59, 130, 246)"
              className="hover:r-5 transition-all"
            />
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="gray"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="gray"
          strokeWidth="1"
        />
      </svg>
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Normal Level ({normalLevel}/10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Your Level</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 w-full max-w-md">
          {data.map((d, i) => (
            <span key={i} className="truncate max-w-[60px]">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

