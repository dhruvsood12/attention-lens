import { motion } from "framer-motion";
import { Brain, BarChart3, Layers, Cpu, Database, FlaskConical, Eye, Sparkles, AlertTriangle, Scale } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const signals = [
  { icon: FlaskConical, title: "Curiosity Gap", desc: "Evaluates how effectively the content creates an information gap — a sense that there's something worth knowing — that motivates click-through." },
  { icon: BarChart3, title: "Specificity", desc: "Measures use of concrete details, numbers, or precise claims. Specific titles outperform vague ones by giving readers a reason to trust the content." },
  { icon: Brain, title: "Emotional Impact", desc: "Scores the emotional resonance of language choices — power words, sentiment polarity, and affective loading that drives engagement." },
  { icon: Eye, title: "Clarity", desc: "Assesses readability and structural coherence. How quickly can a reader understand what this content offers?" },
  { icon: Sparkles, title: "Novelty", desc: "Detects whether the framing presents a fresh angle or unexpected take. Familiar framings compete with more content for attention." },
  { icon: Cpu, title: "Urgency", desc: "Identifies time-sensitive framing, scarcity signals, and temporal language that drives immediate action." },
  { icon: Layers, title: "Shareability", desc: "Predicts viral potential based on social proof cues, relatability, and format alignment with platform norms." },
];

const thumbnailSignals = [
  { icon: Eye, title: "Visual Contrast", desc: "Evaluates whether the thumbnail would stand out in a crowded feed based on color contrast, composition, and focal point clarity." },
  { icon: Scale, title: "Semantic Alignment", desc: "Measures how well the title and thumbnail reinforce the same message. Misalignment creates cognitive friction and reduces click-through." },
];

const pipeline = [
  { step: "01", title: "Input Processing", desc: "Tokenize and normalize text input. Extract structural features like length, punctuation patterns, and format signals." },
  { step: "02", title: "Signal Extraction", desc: "Run multi-signal analysis across linguistic, semantic, and engagement dimensions. Each signal is scored independently." },
  { step: "03", title: "Platform Calibration", desc: "Adjust weights based on platform-specific engagement norms. What works on LinkedIn is different from what works on TikTok." },
  { step: "04", title: "Score Aggregation", desc: "Combine signal scores into an overall engagement prediction with confidence intervals based on input quality." },
];

const limitations = [
  "Scores are statistical predictions, not guarantees. A high score doesn't guarantee virality — it indicates stronger engagement signals.",
  "The model reflects patterns in historical data. It may underweight genuinely novel content that doesn't match existing patterns.",
  "Context matters. Audience size, posting time, algorithm changes, and current events all affect real-world performance.",
  "Thumbnail analysis requires visual input. Without it, visual contrast and semantic alignment signals are not scored.",
  "The tool evaluates attention signals, not content quality. A clickbait title can score high but damage trust over time.",
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function Methodology() {
  return (
    <PageLayout>
      <div className="relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative container section-padding max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-6">
              <Database className="h-3 w-3" /> How it works
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Methodology</h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-balance leading-relaxed">
              AttentionLens uses multi-signal analysis to predict how engaging a piece of content will be. It's a decision-support tool — not a quality judgment.
            </p>
          </motion.div>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-3">What the Score Means</h2>
            <div className="glass-card p-6 mb-6">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                The engagement score is a composite prediction of how likely a title or headline is to capture attention and drive interaction — clicks, shares, saves, or comments — based on the signals present in the text. It ranges from 0 to 100 and is accompanied by a confidence value that reflects how much signal the model had to work with.
              </p>
              <p className="text-sm text-secondary-foreground leading-relaxed mt-3">
                A score of 75+ typically indicates strong engagement signals across multiple dimensions. Below 50 suggests the content may struggle to stand out in competitive feeds. The score is most useful for <strong className="text-foreground">relative comparisons</strong> — testing variants against each other — rather than as an absolute measure.
              </p>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-2">Attention Signals — Text</h2>
            <p className="text-sm text-muted-foreground mb-8">Each signal is scored independently from 0–100 based on linguistic and semantic features.</p>
            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              {signals.map((s) => (
                <motion.div key={s.title} variants={stagger.item} className="glass-card p-5 flex items-start gap-5 hover-lift">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-2">Attention Signals — Visual</h2>
            <p className="text-sm text-muted-foreground mb-8">These signals are only scored when a thumbnail image is provided.</p>
            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              {thumbnailSignals.map((s) => (
                <motion.div key={s.title} variants={stagger.item} className="glass-card p-5 flex items-start gap-5 hover-lift">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Analysis Pipeline</h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
                {pipeline.map((p) => (
                  <motion.div key={p.step} variants={stagger.item} className="flex items-start gap-6 relative">
                    <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0 z-10">
                      <span className="text-xs font-mono font-bold text-primary">{p.step}</span>
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-semibold mb-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-chart-average" /> Limitations & Ethical Notes
            </h2>
            <p className="text-sm text-muted-foreground mb-6">No model captures full reality. Here's what to keep in mind.</p>
            <div className="glass-card p-6">
              <ul className="space-y-4">
                {limitations.map((l, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-chart-average shrink-0" />
                    <span className="text-secondary-foreground leading-relaxed">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="glass-card glow-border-accent p-8">
              <h2 className="text-xl font-bold mb-3">Decision Support, Not Truth</h2>
              <div className="text-sm text-secondary-foreground space-y-3 leading-relaxed">
                <p>
                  AttentionLens is a <strong className="text-foreground">decision-support tool</strong>. It helps creators make more informed choices about how to frame their content — it does not define what is "good" or "bad" content.
                </p>
                <p>
                  High engagement ≠ high quality. A clickbait title may score well on curiosity and urgency but damage audience trust over time. Use scores to optimize, not to replace editorial judgment.
                </p>
                <p className="text-muted-foreground text-xs pt-2">
                  The frontend talks to a FastAPI backend. Set <code className="font-mono text-foreground bg-secondary px-1.5 py-0.5 rounded">VITE_API_BASE_URL</code> to point to your API (default: http://localhost:8000).
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
