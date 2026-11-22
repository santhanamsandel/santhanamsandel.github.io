import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import AILab from "@/components/sections/AILab";
import Training from "@/components/sections/Training";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <AILab />
        <Training />
        <Credentials />
        <Contact />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {profile.name}. AI/ML Engineer & Technical Trainer.</p>
          <a href="#top" className="font-mono text-xs uppercase tracking-[0.2em] transition hover:text-cyan">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
