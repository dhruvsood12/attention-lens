import { motion } from "framer-motion";
import { getScoreBgColor } from "@/lib/api";

interface MetricBarProps {
  label: string;
  value: number;
  description?: string;
  delay?: number;
}

export default function MetricBar({ label, value, description, delay = 0 }: MetricBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{label}</span>
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
        <span className="font-mono font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getScoreBgColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + delay }}
        />
      </div>
    </div>
  );
}
