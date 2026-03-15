import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/api";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

const SCORE_STROKE_COLORS: Record<string, string> = {
  "text-chart-excellent": "hsl(var(--chart-excellent))",
  "text-chart-good": "hsl(var(--chart-good))",
  "text-chart-average": "hsl(var(--chart-average))",
  "text-chart-poor": "hsl(var(--chart-poor))",
  "text-chart-bad": "hsl(var(--chart-bad))",
};

export default function ScoreRing({ score, size = 120, strokeWidth = 8, showLabel = true, className = "" }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const colorClass = getScoreColor(score);
  const strokeColor = SCORE_STROKE_COLORS[colorClass] ?? "hsl(var(--primary))";

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold font-mono ${colorClass} ${size >= 100 ? "text-2xl" : "text-lg"}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {score}
        </motion.span>
        {showLabel && <span className="text-xs text-muted-foreground mt-0.5">{getScoreLabel(score)}</span>}
      </div>
    </div>
  );
}
