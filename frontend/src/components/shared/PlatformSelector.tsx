import { PLATFORMS, type Platform } from "@/lib/api";

interface PlatformSelectorProps {
  value: Platform | undefined;
  onChange: (platform: Platform | undefined) => void;
}

export default function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">
        Platform <span className="text-muted-foreground">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(value === p.value ? undefined : p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              value === p.value ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
