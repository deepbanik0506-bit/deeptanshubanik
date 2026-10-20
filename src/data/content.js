// Site-wide copy. Claims here must match src/data/projects.js and REDESIGN_NOTES.md.

export const SITE_URL = "https://deeptanshubanik.vercel.app";

export const identity = {
    name: "Deeptanshu Banik",
    shortName: "Deep",
    headline: "I build AI workflows that hold up after the demo.",
    lede:
        "Agentic AI and orchestration, approached as a systems problem: deterministic where it can be, a model where it has to be, a person where it matters. Backed by an analyst's habit of asking what the business actually needs.",
    meta: [
        { label: "Now", value: "Building Nuvakin — Intelligence Systems for Education and Career" },
        { label: "Study", value: "B.Tech CSE (AI & Robotics), VIT Chennai, 2024–2028" },
    ],
    email: "deepbanik0506@gmail.com",
    links: {
        github: "https://github.com/deepbanik0506-bit",
        linkedin: "https://www.linkedin.com/in/deeptanshu-banik-95b208317/",
    },
};

// Each principle points at the place in the work where it was practised.
export const principles = [
    {
        id: "reliability",
        statement: "A working demo is not the same as a reliable system.",
        evidence:
            "OASIS keeps 4 of its 50 configured universities live. Every other candidate is waiting on a regression gate that has not yet let one through.",
        href: "/work/oasis/#validation",
        linkLabel: "The gate in OASIS",
    },
    {
        id: "business",
        statement: "Business problems are often more interesting than the technology used to solve them.",
        evidence:
            "The discount study asks a commercial question: at what point does a discount stop paying for itself? The tools are ordinary on purpose.",
        href: "/work/discount-profitability/#problem",
        linkLabel: "The discount question",
    },
    {
        id: "augment",
        statement: "AI should augment human thinking, not replace it.",
        evidence:
            "In OASIS, the system drafts configuration fixes, but a person approves every one, and promotion to the live registry is a manual edit.",
        href: "/work/oasis/#decisions",
        linkLabel: "Human approval by design",
    },
    {
        id: "judgement",
        statement:
            "Intelligence is knowing when to do what, using the tools at hand, and changing your mind when the argument is better.",
        evidence:
            "OASIS began with no headless browser by design. The evidence changed, so I added one as a scoped fallback and then measured where it did not help.",
        href: "/work/oasis/#decisions",
        linkLabel: "A reversed decision",
    },
];

// Capability → the projects that demonstrate it. No self-rated skill levels.
export const capabilities = [
    {
        id: "orchestration",
        label: "LLM orchestration inside deterministic systems",
        detail: "Models confined to the narrow jobs rules can't do, with output that can never overwrite known facts.",
        projects: ["oasis"],
    },
    {
        id: "reliability",
        label: "Reliability engineering",
        detail: "Regression suites, CI, promotion gates, change detection and duplicate quarantine.",
        projects: ["oasis"],
    },
    {
        id: "hitl",
        label: "Human-in-the-loop workflow design",
        detail: "Review queues and approval steps placed where a wrong automated action is costly.",
        projects: ["oasis"],
    },
    {
        id: "services",
        label: "Service and API design",
        detail: "FastAPI services over isolated modules, with layer boundaries enforced by tests.",
        projects: ["oasis"],
    },
    {
        id: "analytics",
        label: "Analytics and SQL",
        detail: "Turning a commercial question into queries, thresholds and a dashboard.",
        projects: ["discount-profitability"],
    },
    {
        id: "modelling",
        label: "Modelling and evaluation",
        detail: "Classification and clustering, read critically: thresholds, overlap, data provenance.",
        projects: ["churn", "segmentation"],
    },
];

export const experience = [
    {
        org: "Nuvakin",
        title: "Building Nuvakin",
        line: "Intelligence Systems for Education and Career",
        period: "2026 — present",
        points: [
            "Designed and built OASIS, the extraction and recommendation engine behind the platform.",
            "Prototyped a local-LLM outreach qualification workflow with mandatory human review.",
        ],
    },
    {
        // Design and architecture only: the dashboard was specified, not coded; the query layer was not built.
        org: "Klub Ventures",
        title: "Business Intelligence & Analytics Intern",
        line: "Remote",
        period: "May — Jul 2026",
        points: [
            "Designed and specified an executive KPI dashboard for MySpace, an internal project-management platform: the four-section hierarchy, formulas and decision logic.",
            "Researched the requirements and architected an MCP-based natural-language query layer intended to let executives query MySpace data through Claude.",
        ],
    },
    {
        org: "Coratia Technologies Pvt. Ltd.",
        title: "Apprentice (Data Analytics Intern)",
        period: "Sep — Oct 2024",
        points: [
            "Cleaned and processed raw datasets with Pandas and NumPy.",
            "Ran exploratory analysis and built visualisations in Matplotlib and Seaborn.",
            "Applied basic machine-learning techniques to prediction tasks.",
        ],
    },
    {
        org: "Vellore Institute of Technology, Chennai",
        title: "B.Tech, Computer Science and Engineering",
        line: "Specialisation in AI & Robotics",
        period: "2024 — 2028",
        points: [],
    },
];

export const interests = ["physics", "psychology", "mathematics", "AI orchestration"];
