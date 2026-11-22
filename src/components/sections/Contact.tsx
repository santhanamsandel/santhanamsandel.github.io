"use client";

import { ArrowUpRight, Check, Copy, Download, Mail, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile } from "@/data/profile";
import { GitHubIcon, LinkedInIcon, Reveal, SectionHeading } from "../ui";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
    { label: "LinkedIn", value: "in/santhanam-l26", href: profile.linkedin, Icon: LinkedInIcon },
    { label: "GitHub", value: "santhanamsandel", href: profile.github, Icon: GitHubIcon },
  ];

  function copy() {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  // Static site: the form composes an email in the visitor's mail app (no data leaves their browser otherwise).
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "");
    const email = String(f.get("email") || "");
    const message = String(f.get("message") || "");
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const input =
    "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-soft placeholder:text-muted/70 transition focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/20";

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36" aria-labelledby="contact-title">
      <div aria-hidden className="absolute bottom-0 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),rgba(168,85,247,0.08)_40%,transparent_70%)] blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="contact-title" eyebrow="Get in touch" title="Contact" lead="Open to AI/ML engineering roles, Generative AI projects, corporate training engagements and academic partnerships." />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            {channels.map(({ label, value, href, Icon }, i) => (
              <Reveal key={label} delay={i * 0.06}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glass-strong group flex items-center gap-4 rounded-2xl p-5 transition hover:border-cyan/50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
                    <span className="block truncate text-soft">{value}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                </a>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={profile.resume}
                  download
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan to-electric px-5 py-4 font-medium text-ink"
                >
                  <Download className="h-4 w-4" /> Download Resume
                </a>
                <button
                  onClick={copy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line px-5 py-4 text-soft transition hover:border-cyan/50"
                >
                  {copied ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy email"}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-sm text-soft/85">Name</label>
                  <input id="c-name" name="name" required autoComplete="name" className={input} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-sm text-soft/85">Email</label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" className={input} placeholder="you@company.com" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="c-msg" className="mb-1.5 block text-sm text-soft/85">Message</label>
                <textarea id="c-msg" name="message" required rows={5} className={`${input} resize-y`} placeholder="Tell me about the role, project or training you have in mind…" />
              </div>
              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-soft px-5 py-3.5 font-medium text-ink transition hover:bg-cyan sm:w-auto"
              >
                <Send className="h-4 w-4" /> Send message
              </button>
              <p className="mt-3 text-xs text-muted" aria-live="polite">
                {sent ? "Your email app should open with the message ready to send." : "Opens your email app with the message pre-filled."}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
