import { motion } from "framer-motion";
import { type AnalysisResult, getConfidenceLabel } from "@/lib/api";
import ScoreRing from "@/components/ui/ScoreRing";
import MetricBar from "@/components/ui/MetricBar";
import { TrendingUp, TrendingDown, Lightbulb, Shield } from "lucide-react";

interface ResultPanelProps {
  result: AnalysisResult;
  compact?: boolean;
}

export default function ResultPanel({ result, compact = false }: ResultPanelProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="glass-card glow-border p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <ScoreRing score={result.overallScore} size={compact ? 110 : 140} />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold mb-1">Engagement Score</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-md">"{result.title}"</p>
            <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
              <Stat label="Predicted CTR" value={`${result.predictedCTR}%`} />
              <Stat label="Engagement" value={`${result.predictedEngagement}%`} />
              <Stat label="Confidence" value={`${result.confidence}%`} sublabel={getConfidenceLabel(result.confidence)} />
              {result.platform && <Stat label="Platform" value={result.platform} />}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="font-semibold mb-5 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Signal Breakdown
        </h4>
        <div className="space-y-4">
          {result.signals.map((s, i) => (
            <MetricBar key={s.name} label={s.label} value={s.score} description={s.description} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {!compact && (
        <div className="grid gap-5 md:grid-cols-2">
          {result.drivers.length > 0 && (
            <InsightCard title="Key Drivers" icon={<TrendingUp className="h-4 w-4 text-chart-excellent" />} items={result.drivers} dotColor="bg-chart-excellent" baseDelay={1} />
          )}
          {result.weaknesses.length > 0 && (
            <InsightCard title="Weak Points" icon={<TrendingDown className="h-4 w-4 text-chart-poor" />} items={result.weaknesses} dotColor="bg-chart-poor" baseDelay={1.2} />
          )}
        </div>
      )}

      <InsightCard title="Improvement Suggestions" icon={<Lightbulb className="h-4 w-4 text-chart-average" />} items={result.suggestions} dotColor="bg-chart-average" baseDelay={1.4} />
    </motion.div>
  );
}

function Stat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-base font-bold font-mono text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">
        {label}
        {sublabel && <span className="ml-1 text-primary">· {sublabel}</span>}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  icon,
  items,
  dotColor,
  baseDelay,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  dotColor: string;
  baseDelay: number;
}) {
  return (
    <div className="glass-card p-6">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        {icon} {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: baseDelay + i * 0.12 }}
            className="flex items-start gap-3 text-sm"
          >
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dotColor} shrink-0`} />
            <span className="text-secondary-foreground">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
