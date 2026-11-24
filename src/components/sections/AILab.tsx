"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Pause, Play, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useInView, useIsMobile, useReducedMotion, useWebGL } from "@/lib/hooks";
import { Reveal, SectionHeading } from "../ui";
import { certifications, education, experience, profile, projects, skillGroups } from "@/data/profile";

const LabNetwork = dynamic(() => import("../three/LabNetwork"), { ssr: false });

type Stage = { name: string; detail: string; tools: string };
type Pipeline = { id: string; title: string; tagline: string; source: string; stages: Stage[] };

const pipelines: Pipeline[] = [
  {
    id: "ml",
    title: "ML Workflow",
    tagline: "How a churn-prediction model goes from raw data to decisions.",
    source: "Based on my Customer Churn Prediction project",
    stages: [
      { name: "Collect", detail: "Gather historical customer records — usage, tenure, billing, support history — and define the target: did the customer leave?", tools: "SQL · Pandas" },
      { name: "Clean", detail: "Handle missing values, fix types and remove duplicates so the model learns from signal, not noise.", tools: "Pandas · NumPy" },
      { name: "Engineer", detail: "Create informative features and rebalance the classes — churners are rare, so imbalance handling matters.", tools: "Feature engineering" },
      { name: "Train", detail: "Fit and compare classifiers such as logistic regression and decision trees using cross-validation.", tools: "Scikit-Learn" },
      { name: "Evaluate", detail: "Go beyond accuracy (88%) — track false negatives, the customers we'd miss. Tuning cut them by 15%.", tools: "Confusion matrix · Recall" },
      { name: "Act", detail: "Score customers and hand the high-risk list to retention teams for proactive offers.", tools: "Reports · Dashboards" },
    ],
  },
  {
    id: "agent",
    title: "LLM Agent Loop",
    tagline: "How an AI agent turns an instruction into actions in a real browser.",
    source: "Based on my Web Automation with AI Agents project",
    stages: [
      { name: "Instruct", detail: "The user describes a goal in plain language through the Gradio Web UI.", tools: "Gradio" },
      { name: "Plan", detail: "An LLM (OpenAI, Google, Anthropic, DeepSeek or a local Ollama model) breaks the goal into concrete next steps.", tools: "LLM providers" },
      { name: "Act", detail: "The agent executes a step in the browser — navigate, click, type, extract.", tools: "browser-use" },
      { name: "Observe", detail: "Page state is captured and fed back to the model so it can see what changed.", tools: "DOM · Screenshots" },
      { name: "Reflect", detail: "The model checks progress against the goal and decides whether to continue, retry or finish.", tools: "Reasoning loop" },
      { name: "Report", detail: "The agent returns the result and the trail of actions it took.", tools: "Web UI" },
    ],
  },
  {
    id: "nlp",
    title: "Transformer NLP",
    tagline: "What happens inside a transformer when it reads a sentence.",
    source: "Based on my Hugging Face Transformers notebook",
    stages: [
      { name: "Text", detail: "Raw input text — a customer review, a question, a support ticket.", tools: "Input" },
      { name: "Tokenize", detail: "Text is split into sub-word tokens and mapped to integer IDs from the model's vocabulary.", tools: "Tokenizer" },
      { name: "Embed", detail: "Each token ID becomes a dense vector, plus position information so order is preserved.", tools: "Embeddings" },
      { name: "Attend", detail: "Self-attention lets every token weigh every other token — this is how context is captured.", tools: "Multi-head attention" },
      { name: "Predict", detail: "A task head turns the contextual vectors into an output: a label, an answer span or generated text.", tools: "pipeline()" },
    ],
  },
];

/** Lightweight SVG fallback used when WebGL is unavailable. */
function StaticNetwork({ layers, active }: { layers: number; active: number }) {
  const sizes = [4, 6, 7, 7, 6, 4, 3];
  const cols = Array.from({ length: layers }, (_, l) => {
    const n = sizes[l % sizes.length];
    const x = 8 + (l / Math.max(1, layers - 1)) * 84;
    return Array.from({ length: n }, (_, k) => ({ x, y: 12 + ((k + 0.5) / n) * 70 }));
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {cols.slice(0, -1).map((col, l) =>
        col.flatMap((a, i) =>
          cols[l + 1].map((b, j) => (
            <line key={`${l}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke"
              stroke={l < active ? (l === active - 1 ? "#22d3ee" : "#3b82f6") : "#1e293b"} strokeOpacity={l < active ? 0.5 : 0.6} strokeWidth="1" />
          )),
        ),
      )}
      {cols.map((col, l) =>
        col.map((n, i) => (
          <ellipse key={`${l}-${i}`} cx={n.x} cy={n.y} rx="0.9" ry="1.6" fill={l === active ? "#a5f3fc" : l < active ? "#38bdf8" : "#475569"} />
        )),
      )}
    </svg>
  );
}

/* ---------- Tiny keyword-retrieval assistant (runs locally, no API) ---------- */
type KB = { keys: string[]; answer: string };
const kb: KB[] = [
  { keys: ["experience", "work", "job", "career", "company", "worked"], answer: experience.map((e) => `${e.role} at ${e.org} (${e.period})`).join(" · ") },
  { keys: ["current", "now", "anudip", "present"], answer: `Currently ${experience[0].role} at ${experience[0].org} — ${experience[0].points[0]}` },
  { keys: ["ibm", "corporate", "spss", "watsonx", "cloud"], answer: `${experience[2].points[0]} He also built a Watsonx-powered support chatbot that cut response time by 40%.` },
  { keys: ["skill", "stack", "tech", "tools", "know", "technologies"], answer: skillGroups.map((g) => `${g.title}: ${g.items.slice(0, 5).join(", ")}`).join(" | ") },
  { keys: ["project", "built", "build", "portfolio", "github"], answer: `Highlights: ${projects.slice(0, 4).map((p) => p.title).join("; ")}. More at github.com/santhanamsandel.` },
  { keys: ["agent", "llm", "generative", "genai", "gen", "ai"], answer: `${projects[0].title}: ${projects[0].solution}` },
  { keys: ["teach", "train", "trainer", "students", "learners", "course"], answer: "He has trained 330+ learners (Anudip, Magic Bus) and 50+ corporate professionals in Python, SQL, Excel, Power BI, ML and IBM Cloud AI — with an 88% completion rate and a 4.6/5 trainer rating." },
  { keys: ["education", "degree", "msc", "university", "study", "qualification"], answer: education.map((e) => `${e.degree}, ${e.school} (${e.period})`).join(" · ") },
  { keys: ["certificate", "certification", "certified", "course"], answer: certifications.map((c) => `${c.title} (${c.issuer}, ${c.date})`).join(" · ") },
  { keys: ["contact", "email", "hire", "reach", "linkedin", "connect"], answer: `Email ${profile.email} or connect on LinkedIn — linkedin.com/in/santhanam-l26.` },
  { keys: ["power", "bi", "excel", "sql", "analytics", "dashboard"], answer: "Data analytics is a core strength: he teaches Excel, SQL and Power BI to cohorts and built the ElectroGear retail analytics curriculum (800+ transactions, 25 business questions)." },
];

function retrieve(q: string) {
  const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  let best: KB | null = null;
  let score = 0;
  for (const item of kb) {
    const s = item.keys.reduce((acc, k) => acc + (words.some((w) => w.startsWith(k) || k.startsWith(w) && w.length > 3) ? 1 : 0), 0);
    if (s > score) {
      score = s;
      best = item;
    }
  }
  return best ? best.answer : "I couldn't match that. Try asking about experience, projects, skills, training, education or contact.";
}

function Assistant() {
  const [msgs, setMsgs] = useState<{ from: "bot" | "me"; text: string }[]>([
    { from: "bot", text: "Hi! Ask me about Santhanam's experience, projects, skills or training." },
  ]);
  const [q, setQ] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const suggestions = ["What does he teach?", "Show projects", "Current role?", "Certifications"];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  function ask(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setQ("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: retrieve(text) }]), 350);
  }
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(q);
  }

  return (
    <div className="glass-strong flex h-full flex-col rounded-2xl">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan to-violet text-ink">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-soft">Portfolio Assistant</p>
          <p className="text-[11px] text-muted">Keyword retrieval over this page · runs in your browser</p>
        </div>
      </div>
      <div ref={listRef} className="h-64 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.from === "me" ? "ml-auto bg-cyan/15 text-soft" : "bg-white/5 text-soft/90"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {suggestions.map((s) => (
          <button key={s} onClick={() => ask(s)} className="min-h-9 rounded-full border border-white/15 px-3.5 py-2 text-xs text-soft/75 transition hover:border-cyan/50 hover:text-cyan">
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3">
        <label htmlFor="assistant-q" className="sr-only">Ask a question</label>
        <input
          id="assistant-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask anything…"
          className="min-w-0 flex-1 rounded-xl border border-line bg-ink/60 px-3.5 py-2.5 text-sm text-soft placeholder:text-muted focus:border-cyan/60 focus:outline-none"
        />
        <button type="submit" aria-label="Send" className="grid h-10 w-10 place-items-center rounded-xl bg-cyan text-ink transition hover:bg-cyan/80">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function AILab() {
  const [pid, setPid] = useState(pipelines[0].id);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const webgl = useWebGL();
  const p = pipelines.find((x) => x.id === pid)!;

  useEffect(() => {
    if (!playing || reduced || !inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % p.stages.length), 3200);
    return () => clearInterval(id);
  }, [playing, reduced, inView, p.stages.length]);

  return (
    <section id="lab" className="relative py-24 md:py-36" aria-labelledby="lab-title">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(34,211,238,0.07),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="lab-title" eyebrow="See how the AI works" title="AI Lab" lead="Interactive walkthroughs of the systems behind my projects — the same way I explain them in class. Pick a pipeline and step through each stage." />

        <Reveal>
          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Pipelines">
            {pipelines.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === pid}
                onClick={() => {
                  setPid(x.id);
                  setStage(0);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  x.id === pid ? "border-cyan bg-cyan/15 text-cyan" : "border-line text-muted hover:text-soft"
                }`}
              >
                {x.title}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <Reveal>
            <div ref={ref} className="glass-strong relative overflow-hidden rounded-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-line p-5">
                <div>
                  <p className="font-display text-lg font-semibold text-soft">{p.tagline}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{p.source}</p>
                </div>
                <button
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-soft hover:border-cyan/50"
                >
                  {playing && !reduced ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>

              {/* 3D network visual */}
              <div className="relative h-56 bg-gradient-to-b from-navy/40 to-transparent sm:h-72">
                <div aria-hidden className="grid-bg absolute inset-0" />
                {webgl === false && <StaticNetwork layers={p.stages.length} active={stage} />}
                {webgl && inView && (
                  <LabNetwork layers={p.stages.length} active={stage} animate={!reduced} running={inView} low={isMobile} />
                )}
                {/* Stage labels under the layers */}
                <div className="absolute inset-x-3 bottom-2 flex justify-between">
                  {p.stages.map((s, i) => (
                    <span key={s.name} className={`font-mono text-[9px] uppercase tracking-wider transition sm:text-[10px] ${i === stage ? "text-cyan" : i < stage ? "text-electric" : "text-muted"}`}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stepper */}
              <ol className="flex border-t border-line" aria-label="Stages">
                {p.stages.map((s, i) => (
                  <li key={s.name} className="flex-1">
                    <button
                      onClick={() => {
                        setStage(i);
                        setPlaying(false);
                      }}
                      aria-current={i === stage ? "step" : undefined}
                      aria-label={`Stage ${i + 1}: ${s.name}`}
                      className="group relative h-12 w-full"
                    >
                      <span className={`absolute inset-x-0 top-0 h-0.5 transition ${i <= stage ? "bg-cyan" : "bg-line"}`} />
                      <span className={`font-mono text-xs ${i === stage ? "text-cyan" : "text-muted group-hover:text-soft"}`}>0{i + 1}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="min-h-[150px] border-t border-line p-5 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div key={`${pid}-${stage}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35 }}>
                    <p className="eyebrow">
                      Stage {stage + 1} / {p.stages.length}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-soft">{p.stages[stage].name}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{p.stages[stage].detail}</p>
                    <p className="mt-3 inline-block rounded-md border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-xs text-violet">
                      {p.stages[stage].tools}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Assistant />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
