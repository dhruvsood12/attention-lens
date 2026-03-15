import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GitCompare, Zap, Target, TrendingUp, Sparkles, Eye, Brain } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const features = [
  { icon: Zap, title: "Instant Scoring", desc: "Get engagement predictions in seconds with multi-signal analysis across curiosity, clarity, emotion, and more." },
  { icon: GitCompare, title: "A/B Compare", desc: "Test up to 5 title variants head-to-head with ranked results and per-signal breakdowns." },
  { icon: Target, title: "Actionable Insights", desc: "See what's driving engagement and what's holding it back — with specific suggestions to improve." },
  { icon: Brain, title: "Signal-Level Detail", desc: "Understand exactly which attention signals are strong and which need work across 7+ dimensions." },
  { icon: Eye, title: "Thumbnail Analysis", desc: "Upload a thumbnail to score visual contrast and title-image semantic alignment." },
  { icon: TrendingUp, title: "Platform Context", desc: "Select a platform to calibrate scores for YouTube, LinkedIn, Twitter, TikTok, and more." },
];

const stats = [
  { value: "7+", label: "Attention Signals" },
  { value: "<3s", label: "Analysis Time" },
  { value: "5", label: "Variants per Compare" },
  { value: "94%", label: "Signal Accuracy" },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
};

export default function Landing() {
  return (
    <PageLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative container section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-8">
              <Sparkles className="h-3 w-3" />
              Predict engagement before you publish
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-6 text-balance">
              Know if your content will <span className="gradient-text">land</span> before it drops
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 text-balance">
              AttentionLens scores your headlines, titles, and hooks across 7+ engagement signals — so you can ship with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_hsl(165_80%_48%/0.3)]">
                Analyze a Title <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/compare" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors">
                <GitCompare className="h-4 w-4" /> Compare Variants
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35 }} className="mt-16 max-w-2xl mx-auto">
            <div className="glass-card glow-border p-6 text-left">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-3 w-3 rounded-full bg-chart-bad" />
                <div className="h-3 w-3 rounded-full bg-chart-average" />
                <div className="h-3 w-3 rounded-full bg-chart-excellent" />
                <span className="ml-auto text-xs text-muted-foreground font-mono">analysis.preview</span>
              </div>
              <div className="mb-4 px-1">
                <p className="text-xs text-muted-foreground mb-1">Title</p>
                <p className="text-sm font-medium">"Why Most Founders Get Pricing Wrong"</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Curiosity Gap", pct: "86%", color: "bg-chart-excellent", val: 86 },
                  { label: "Specificity", pct: "72%", color: "bg-chart-good", val: 72 },
                  { label: "Emotional Impact", pct: "78%", color: "bg-chart-good", val: 78 },
                  { label: "Clarity", pct: "91%", color: "bg-chart-excellent", val: 91 },
                  { label: "Novelty", pct: "54%", color: "bg-chart-average", val: 54 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">{item.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div className={`h-full rounded-full ${item.color}`} initial={{ width: 0 }} animate={{ width: item.pct }} transition={{ duration: 1.2, delay: 0.8 }} />
                    </div>
                    <span className="font-mono text-xs font-semibold w-7 text-right text-foreground">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Overall</span>
                  <span className="font-mono text-sm font-bold text-chart-excellent">82</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="font-mono text-sm font-bold text-foreground">89%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/30">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for creators who ship</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Every signal is designed to give you a clear, actionable read on what makes content perform.</p>
          </motion.div>
          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <motion.div key={f.title} variants={stagger.item} className="glass-card p-6 hover-lift group">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="glass-card glow-border p-10 sm:p-12 text-center max-w-2xl mx-auto">
            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to predict engagement?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Paste your title and get instant, signal-level feedback on what's working and what's not.</p>
            <Link to="/analyze" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_hsl(165_80%_48%/0.3)]">
              Start Analyzing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
