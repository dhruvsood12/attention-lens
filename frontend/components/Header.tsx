import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          AttentionLens
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/analyze" className="hover:text-foreground transition-colors">
            Analyze
          </Link>
          <Link href="/methodology" className="hover:text-foreground transition-colors">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
