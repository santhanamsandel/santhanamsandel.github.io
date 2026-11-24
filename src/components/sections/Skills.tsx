"use client";

import { BarChart3, Bot, Code2, Cpu, Terminal } from "lucide-react";
import { skillGroups } from "@/data/profile";
import { Reveal, SectionHeading, TiltCard } from "../ui";

const icons: Record<string, typeof Cpu> = { programming: Terminal, ai: Cpu, genai: Bot, data: BarChart3, dev: Code2 };
// bento layout on large screens
const spans: Record<string, string> = {
  programming: "lg:col-span-2",
  ai: "lg:col-span-4",
  genai: "lg:col-span-4",
  data: "lg:col-span-2",
  dev: "lg:col-span-6",
};

// Hand-picked short marks for technology "icons" (no external icon dependency, no brand logos).
const marks: Record<string, string> = {
  Python: "Py", SQL: "SQL", "Core Java": "Jv", "Machine Learning": "ML", "Scikit-Learn": "Sk", NLP: "NLP",
  "Hugging Face Transformers": "HF", "IBM SPSS": "SP", LLMs: "LLM", "AI Agents": "Ag", "Browser Automation": "BA",
  "IBM Watsonx": "Wx", "IBM Cloud AI": "IC", "OpenAI / Azure OpenAI": "OA", "Google Gemini": "Gm", Anthropic: "An",
  DeepSeek: "DS", Ollama: "Ol", Gradio: "Gr", "Power BI": "BI", "Advanced Excel": "Xl", Tableau: "Tb", Pandas: "Pd",
  NumPy: "Np", Matplotlib: "Mp", Seaborn: "Sb", Streamlit: "St", FastAPI: "API", Django: "Dj", SQLAlchemy: "SA",
  MySQL: "My", "Git & GitHub": "Git", "Jupyter Notebook": "Jn", "VS Code": "VS", "IntelliJ IDEA": "IJ",
};
const mark = (s: string) => marks[s] ?? s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const tones = ["text-cyan border-cyan/30 bg-cyan/10", "text-sky-300 border-electric/30 bg-electric/10", "text-violet-300 border-violet/30 bg-violet/10"];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32" aria-labelledby="skills-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="skills-title"
          eyebrow="What I work with"
          title="Tech stack"
          lead="Technologies from my resume, training work and public GitHub projects — grouped by how I use them."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((g, gi) => {
            const Icon = icons[g.id] ?? Code2;
            return (
              <Reveal key={g.id} delay={gi * 0.06} className={`${spans[g.id] ?? ""} ${g.id === "dev" ? "md:col-span-2" : ""}`}>
                <TiltCard max={4}>
                  <div className="relative h-full p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/30 bg-ink/60 text-cyan shadow-[0_0_24px_-8px_rgba(34,211,238,0.6)]">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-soft md:text-xl">{g.title}</h3>
                          <p className="text-sm text-muted">{g.blurb}</p>
                        </div>
                      </div>
                      <span className="hidden shrink-0 font-mono text-[11px] text-cyan/80 sm:block">{String(g.items.length).padStart(2, "0")}</span>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {g.items.map((s, i) => (
                        <li
                          key={s}
                          className="group/skill flex items-center gap-2 rounded-xl border border-white/10 bg-ink/50 py-1.5 pl-1.5 pr-3.5 text-sm text-soft transition hover:-translate-y-0.5 hover:border-cyan/50"
                        >
                          <span aria-hidden className={`grid h-7 min-w-7 place-items-center rounded-lg border px-1 font-mono text-[10px] font-bold ${tones[(gi + i) % 3]}`}>
                            {mark(s)}
                          </span>
                          <span className="transition group-hover/skill:text-cyan">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
