import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container section-padding text-center">
        <h1 className="text-6xl font-black text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Back to Home
        </Link>
      </div>
    </PageLayout>
  );
}
