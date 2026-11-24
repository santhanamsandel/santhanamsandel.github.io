// Single source of truth for portfolio content.
// Everything here is taken from Santhanam's resume and public GitHub repositories.
// To update the site, edit this file and push to `main`.

export const profile = {
  name: "Santhanam L",
  headline: ["Senior AI/ML Engineer", "Generative AI Specialist", "Technical Trainer"],
  intro:
    "I build practical AI — from machine learning models to LLM-powered agents — and I teach others to do the same. 380+ learners and professionals trained in Python, SQL, Power BI, machine learning and AI.",
  location: "Tamil Nadu, India",
  email: "santhanaml2605@gmail.com",
  linkedin: "https://www.linkedin.com/in/santhanam-l26/",
  github: "https://github.com/santhanamsandel",
  resume: "/Santhanam_L_Resume.pdf",
};

export const stats = [
  { value: 330, suffix: "+", label: "Learners trained", note: "Anudip + Magic Bus batches" },
  { value: 50, suffix: "+", label: "Professionals upskilled", note: "Across 4 organisations" },
  { value: 88, suffix: "%", label: "Course completion", note: "Excel · SQL · Power BI" },
  { value: 4.6, suffix: "/5", label: "Avg. trainer rating", note: "Corporate training", decimals: 1 },
];

export const about = {
  paragraphs: [
    "I'm an AI/ML practitioner and technical educator with an M.Sc. in Computer Science from Bharathiar University. My work sits where engineering meets teaching: I build machine learning models, LLM-powered agents and analytics solutions, then turn that experience into hands-on programmes that get people job-ready.",
    "As a Corporate Trainer for an IBM Business Partner I taught Python, IBM Cloud AI and SPSS to working professionals and built industry case studies around real business problems. Since then I've trained hundreds of learners in Python, machine learning, Excel, SQL and Power BI — always project-first, with real datasets and real assessments.",
  ],
  pillars: [
    { title: "AI & ML Engineering", text: "Supervised & unsupervised models, feature engineering, imbalanced data, evaluation." },
    { title: "Generative AI", text: "LLM-driven agents, multi-provider LLM integration (OpenAI, Google, Anthropic, DeepSeek, Ollama), IBM Watsonx chatbots." },
    { title: "Data Analytics", text: "Python, SQL, Power BI and Excel — from raw data to dashboards and decisions." },
    { title: "Technical Training", text: "Instructor-led, project-based learning with mentoring, assessments and placement focus." },
  ],
};

export type SkillGroup = { id: string; title: string; blurb: string; items: string[] };

// Grouped exactly from the resume + public GitHub repos. No proficiency scores are shown on purpose.
export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    title: "Programming",
    blurb: "Languages I build and teach with every day.",
    items: ["Python", "SQL", "Core Java"],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    blurb: "Building and evaluating predictive models end to end.",
    items: ["Machine Learning", "Scikit-Learn", "Supervised Learning", "Unsupervised Learning", "Predictive Modelling", "Feature Engineering", "NLP", "Hugging Face Transformers", "IBM SPSS"],
  },
  {
    id: "genai",
    title: "Generative AI",
    blurb: "LLM-powered agents and conversational AI.",
    items: ["LLMs", "AI Agents", "Browser Automation", "IBM Watsonx", "IBM Cloud AI", "OpenAI / Azure OpenAI", "Google Gemini", "Anthropic", "DeepSeek", "Ollama", "Gradio"],
  },
  {
    id: "data",
    title: "Data Analytics",
    blurb: "Turning data into dashboards and decisions.",
    items: ["Power BI", "Advanced Excel", "Tableau", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  {
    id: "dev",
    title: "Development & Tools",
    blurb: "Shipping usable apps, APIs and notebooks.",
    items: ["Streamlit", "FastAPI", "Django", "SQLAlchemy", "MySQL", "Git & GitHub", "Jupyter Notebook", "VS Code", "IntelliJ IDEA"],
  },
];

export type Job = {
  org: string;
  role: string;
  period: string;
  current?: boolean;
  points: string[];
  tags: string[];
  /** headline outcomes, each restated from `points` */
  highlights: string[];
};

export const experience: Job[] = [
  {
    org: "Anudip Foundation",
    role: "Senior Faculty",
    period: "Sep 2025 — Present",
    current: true,
    points: [
      "Deliver instructor-led training in Excel, SQL and Power BI to 150+ learners across multiple batches, with an 88% course completion rate.",
      "Designed hands-on projects on real-world datasets, improving learner assessment scores by 65%.",
      "Mentor students on data interpretation and analytics workflows, contributing to a 65% placement-eligibility rate.",
    ],
    tags: ["Excel", "SQL", "Power BI", "Mentoring"],
    highlights: ["150+ learners", "88% completion", "+65% assessment scores", "65% placement eligibility"],
  },
  {
    org: "Magic Bus India Foundation",
    role: "AI Trainer",
    period: "Mar 2025 — Sep 2025",
    points: [
      "Trained 180+ learners in Python, data preprocessing and foundational machine learning.",
      "Raised average technical assessment scores by 68%.",
    ],
    tags: ["Python", "Data Preprocessing", "Machine Learning"],
    highlights: ["180+ learners", "+68% assessment scores"],
  },
  {
    org: "IBM Business Partner",
    role: "Corporate Trainer",
    period: "Aug 2023 — Feb 2025",
    points: [
      "Delivered corporate training on Python, IBM Cloud AI and SPSS to 50+ professionals across 4 organisations.",
      "Enabled participants to build predictive models, improving data-analysis turnaround time by 20%.",
      "Designed industry-focused case studies around real business problems — average trainer rating 4.6/5.",
    ],
    tags: ["Python", "IBM Cloud AI", "SPSS", "Predictive Models"],
    highlights: ["50+ professionals", "4 organisations", "20% faster analysis turnaround", "4.6/5 trainer rating"],
  },
];

export type Project = {
  title: string;
  category: "Generative AI" | "Machine Learning" | "Data Analytics" | "Python Development";
  period?: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  github?: string;
  visual: "agent" | "chat" | "churn" | "dashboard" | "api" | "nlp" | "qr" | "streamlit";
  featured?: boolean;
};

const gh = (repo: string) => `https://github.com/santhanamsandel/${repo}`;

export const projects: Project[] = [
  {
    title: "Intelligent Web Automation with AI Agents",
    category: "Generative AI",
    period: "Mar — May 2025",
    problem: "Repetitive web tasks are slow to automate with brittle, hand-written scripts.",
    solution:
      "A Gradio Web UI for LLM-driven browser agents (built on the open-source browser-use project) that plan and execute web tasks from natural-language instructions.",
    features: [
      "User-friendly Gradio interface for driving browser agents",
      "Pluggable LLMs: Google, OpenAI, Azure, Anthropic, DeepSeek, Ollama",
      "Supports most browser-use web functionality for automated tasks",
    ],
    tech: ["Python", "Gradio", "LLMs", "AI Agents", "Ollama"],
    github: gh("AI-Agent-Web-Autumation-"),
    visual: "agent",
    featured: true,
  },
  {
    title: "Watsonx Customer Support for E-Commerce",
    category: "Generative AI",
    period: "Nov — Dec 2023",
    problem: "E-commerce support teams were overloaded with repetitive customer queries.",
    solution: "Implemented IBM Watsonx AI to automate support queries with context- and sentiment-aware chatbots.",
    features: [
      "Reduced response time by 40%",
      "Improved query-resolution accuracy by 35%",
      "Context and sentiment understanding in conversations",
    ],
    tech: ["IBM Watsonx", "Conversational AI", "NLP"],
    visual: "chat",
    featured: true,
  },
  {
    title: "Customer Churn Prediction",
    category: "Machine Learning",
    period: "Jun — Jul 2023",
    problem: "Businesses lose revenue when they can't spot customers likely to leave.",
    solution: "A machine-learning model trained on historical customer data to flag churn risk early for retention campaigns.",
    features: [
      "88% model accuracy",
      "Feature engineering & preprocessing for imbalanced data",
      "15% fewer false negatives",
    ],
    tech: ["Python", "Scikit-Learn", "Pandas", "NumPy"],
    visual: "churn",
    featured: true,
  },
  {
    title: "ElectroGear Retail — E-Commerce Analytics",
    category: "Data Analytics",
    problem: "Learners need an end-to-end, business-driven analytics project to bridge beginner Python and real analyst work.",
    solution:
      "A complete analytics curriculum on 800+ e-commerce transactions: cleaning, EDA, 13 visualisations and 25 answered business questions with recommendations.",
    features: [
      "Master notebook with theory cards and solutions",
      "Executive report, exercises, assignments with rubrics",
      "30+ interview questions for career prep",
    ],
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    github: gh("ElectroGear-Retail-E-Commerce-Data-Analytics-Performance-Dashboard"),
    visual: "dashboard",
    featured: true,
  },
  {
    title: "Student Management REST API",
    category: "Python Development",
    problem: "Teaching backend fundamentals needs a clean, realistic CRUD API example.",
    solution: "A FastAPI service with SQLAlchemy models and MySQL persistence exposing full CRUD for student records.",
    features: ["GET / POST / PUT / DELETE endpoints", "Pydantic schemas & layered structure", "Tested with Postman"],
    tech: ["FastAPI", "SQLAlchemy", "MySQL", "Pydantic"],
    github: gh("Restapi"),
    visual: "api",
  },
  {
    title: "NLP with Hugging Face Transformers",
    category: "Machine Learning",
    problem: "Exploring how pretrained transformer models handle real NLP tasks.",
    solution: "A notebook applying Hugging Face Transformers pipelines to natural-language processing tasks.",
    features: ["Pretrained transformer pipelines", "Hands-on NLP experiments", "Notebook-based walkthrough"],
    tech: ["Python", "Transformers", "NLP", "Jupyter"],
    github: gh("Natural-Language-Processing-with-Hugging-Face-Transformers"),
    visual: "nlp",
  },
  {
    title: "QR-Code Student Attendance System",
    category: "Python Development",
    problem: "Manual attendance is slow and error-prone for faculty.",
    solution: "A Django web application that records student attendance by recognising ID-card QR codes, with a faculty view.",
    features: ["QR code recognition from ID cards", "Faculty dashboard", "Branch / section / year management"],
    tech: ["Python", "Django", "QR Recognition"],
    github: gh("-Student-tracking-attendance-system-application-with-ID-card-QR-code-recognition."),
    visual: "qr",
  },
  {
    title: "Python with Streamlit — Teaching App",
    category: "Python Development",
    problem: "Beginners need a fast way to turn Python scripts into interactive apps.",
    solution: "A Streamlit app plus a teaching guide that walks learners from Python basics to a working web UI.",
    features: ["Interactive Streamlit UI", "Step-by-step teaching guide (PDF)", "Classroom-ready example"],
    tech: ["Python", "Streamlit"],
    github: gh("python-with-streamlit"),
    visual: "streamlit",
  },
];

export const teaching = {
  subjects: [
    { name: "Python Programming", area: "Core" },
    { name: "SQL & MySQL", area: "Data" },
    { name: "Advanced Excel", area: "Data" },
    { name: "Power BI", area: "Data" },
    { name: "Data Analytics", area: "Data" },
    { name: "Data Preprocessing", area: "AI" },
    { name: "Machine Learning", area: "AI" },
    { name: "Predictive Modelling", area: "AI" },
    { name: "IBM Cloud AI", area: "AI" },
    { name: "IBM SPSS", area: "AI" },
    { name: "Generative AI & LLMs", area: "AI" },
    { name: "Streamlit & FastAPI", area: "Core" },
  ],
  approach: [
    { title: "Hands-on first", text: "Every concept is practised immediately in code, notebooks or dashboards." },
    { title: "Real-world datasets", text: "Projects built on realistic business data — e-commerce, customers, operations." },
    { title: "Project-based learning", text: "Learners finish with portfolio projects, not just notes." },
    { title: "Mentoring", text: "One-to-one guidance on data interpretation, analytics workflows and careers." },
    { title: "Assessments", text: "Graded assignments and rubrics that measure real skill growth (+65–68% scores)." },
    { title: "Industry-oriented", text: "Case studies designed around actual business problems for corporate teams." },
  ],
  // Programmes delivered — every figure comes from the resume (see `experience`).
  programmes: [
    {
      org: "Anudip Foundation",
      audience: "150+ learners · multiple batches",
      topics: ["Excel", "SQL", "Power BI", "Analytics workflows"],
      outcome: "88% course completion · 65% placement eligibility",
    },
    {
      org: "Magic Bus India Foundation",
      audience: "180+ learners",
      topics: ["Python", "Data preprocessing", "Machine learning basics"],
      outcome: "+68% average technical assessment scores",
    },
    {
      org: "IBM Business Partner",
      audience: "50+ professionals · 4 organisations",
      topics: ["Python", "IBM Cloud AI", "SPSS", "Predictive models"],
      outcome: "4.6/5 average trainer rating",
    },
  ],
};

export const education = [
  { degree: "Master of Computer Science (M.Sc.)", school: "Bharathiar University, Erode", period: "2020 — 2022" },
  { degree: "B.Sc. Computer Technology", school: "Bharathiar University, Erode", period: "2017 — 2020" },
];

export const certifications = [
  {
    title: "Machine Learning with Python",
    issuer: "IBM",
    date: "Nov 2024",
    text: "Supervised and unsupervised algorithms — linear & logistic regression, decision trees and clustering.",
  },
  {
    title: "Introduction to Data Analyst",
    issuer: "IBM",
    date: "Mar 2024",
    text: "The data ecosystem, ETL and big-data basics; gathering, identifying and cleaning data for analysis.",
  },
  {
    title: "Programming in Python",
    issuer: "EduBridge",
    date: "Apr 2023",
    text: "Python syntax, control flow, functions, data structures and procedural programming.",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "moments", label: "Moments" },
  { id: "projects", label: "Projects" },
  { id: "lab", label: "AI Lab" },
  { id: "training", label: "Training" },
  { id: "contact", label: "Contact" },
];
