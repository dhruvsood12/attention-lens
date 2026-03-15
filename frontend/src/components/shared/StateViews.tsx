import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Loader2 } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="flex justify-center mb-4 text-muted-foreground/60">{icon ?? <Search className="h-10 w-10" />}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="glass-card border-destructive/30 p-8 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-1">Analysis Failed</h3>
      <p className="text-sm text-muted-foreground mb-5">{message || "Something went wrong. Please try again."}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
          Try Again
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export function LoadingState({ title = "Analyzing...", subtitle }: LoadingStateProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center">
      <div className="relative mx-auto mb-5 h-12 w-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
      <div className="mt-8 max-w-xs mx-auto space-y-3">
        {[0.8, 0.6, 0.9, 0.5].map((w, i) => (
          <div key={i} className="h-2.5 rounded-full bg-secondary animate-pulse" style={{ width: `${w * 100}%`, animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </motion.div>
  );
}
