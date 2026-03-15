import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">AttentionLens</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
          <Link to="/analyze" className="hover:text-foreground transition-colors">Analyze</Link>
          <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 AttentionLens. All rights reserved.</p>
      </div>
    </footer>
  );
}
