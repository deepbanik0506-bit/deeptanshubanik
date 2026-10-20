// Single source of truth for every project shown on the site.
//
// Evidence rules (see REDESIGN_NOTES.md):
//   kind "engineering" — a property of the codebase, counted from the repo
//   kind "observed"    — recorded by the system while actually running
//   kind "dataset"     — derived from a public or synthetic dataset, not a business outcome
// Every finding carries `basis` (denominator or conditions). Public-repo
// findings also carry `source`; private-repo sources are recorded only in
// REDESIGN_NOTES.md so internal paths never ship in the bundle.

export const EVIDENCE_LABELS = {
    engineering: "Codebase",
    observed: "Observed in use",
    dataset: "Dataset finding",
};

const projects = [
    {
        slug: "oasis",
        title: "OASIS",
        subtitle: "University intelligence engine",
        status: "In development",
        statusTone: "live",
        data: "Public university web pages",
        role: "Designed and built",
        period: "2026 — ongoing",
        context: "Building Nuvakin",
        stack: ["Python", "FastAPI", "Ollama (local LLM)", "Playwright fallback", "unittest", "GitHub Actions"],
        summary:
            "A pipeline that turns inconsistent official university course pages into structured, validated records, plus an explainable recommendation engine on top. Deterministic parsers do the work; a local LLM may only fill fields they left empty.",
        findings: [
            {
                value: "858",
                label: "offline regression tests across 46 files, run in CI",
                kind: "engineering",
                basis: "Test methods at the latest commit; last CI run passed 17 Aug 2026",
            },
            {
                value: "5",
                label: "isolated layers, with isolation enforced by static import tests",
                kind: "engineering",
                basis: "ingestion · recommendation · API · document intake · dashboard",
            },
            {
                value: "4 / 50",
                label: "universities live; none of the 46 candidates has passed the promotion gate yet",
                kind: "observed",
                basis: "Registry status at the latest commit (4 active, 46 candidate)",
            },
        ],
        repo: { public: false },
        caseStudy: "/work/oasis/",
    },
    {
        slug: "discount-profitability",
        title: "Discount & Profitability Study",
        subtitle: "Where discounting stops paying for itself",
        status: "Study",
        statusTone: "study",
        data: "Public dataset: Sample Superstore (US retail)",
        role: "Solo analysis",
        period: "May 2026",
        stack: ["Python", "Pandas", "SQL (SQLite)", "Tableau", "Seaborn"],
        summary:
            "Two earlier analyses merged into one: SQL and pandas work on a public retail dataset to find the discount level at which orders stop making money, and which categories carry the losses.",
        findings: [
            {
                value: "20% → 30%",
                label: "average order profit is positive at 20% discount and negative from 30%",
                kind: "dataset",
                basis: "Mean profit per order line by discount level: +24.7 at 20%, −45.7 at 30%",
                source: "discount-profit-sensitivity-analyzer/notebooks/discount_analysis.ipynb (cell 2)",
            },
            {
                value: "≈20%",
                label: "of revenue came from loss-making order lines",
                kind: "dataset",
                basis: "Share of total sales where line profit < 0 (19.86% in the Tableau dashboard)",
                source: "ecommerce-profit-optimizer/reports/dashboard.png; notebooks/eda.ipynb (cell 16)",
            },
            {
                value: "Furniture",
                label: "weakest category margin; average margin turns negative at 30% discount",
                kind: "dataset",
                basis: "Furniture mean margin +7.2% at 20% discount, −12.1% at 30%",
                source: "discount_analysis.ipynb (cell 6)",
            },
        ],
        repo: {
            public: true,
            url: "https://github.com/deepbanik0506-bit/ecommerce-profit-optimizer",
            secondary: "https://github.com/deepbanik0506-bit/discount-profit-sensitivity-analyzer",
        },
        caseStudy: "/work/discount-profitability/",
    },
    {
        slug: "churn",
        title: "Churn Modelling on Synthetic Data",
        subtitle: "Choosing a threshold, not just a model",
        status: "Study",
        statusTone: "study",
        data: "Synthetic dataset: 100,000 generated telecom customers",
        role: "Solo analysis",
        period: "May 2026",
        stack: ["Python", "Pandas", "scikit-learn"],
        summary:
            "A class-balanced logistic regression on a synthetic churn dataset, used to explore the trade-off between catching churners and raising false alarms.",
        findings: [
            {
                value: "70% → 82%",
                label: "recall when the decision threshold drops from 0.5 to 0.4",
                kind: "dataset",
                basis: "20% stratified hold-out (20,000 rows); precision falls from 52% to 48%",
                source: "customer-churn-prediction/notebook.ipynb (cells 6–7)",
            },
            {
                value: "0.77",
                label: "ROC AUC at the default threshold (accuracy 68.8%)",
                kind: "dataset",
                basis: "Same hold-out; 33% of rows are churners",
                source: "notebook.ipynb (cells 2, 6)",
            },
            {
                value: "Contract",
                label: "type dominates the model; month-to-month carries the highest risk",
                kind: "dataset",
                basis: "Largest coefficients: one-year −1.72, two-year −1.71 vs month-to-month",
                source: "notebook.ipynb (cell 8)",
            },
        ],
        repo: { public: true, url: "https://github.com/deepbanik0506-bit/customer-churn-prediction" },
        caseStudy: "/work/churn/",
    },
    {
        slug: "segmentation",
        title: "Credit-Card Customer Segmentation",
        subtitle: "Honest clusters from weak structure",
        status: "Study",
        statusTone: "study",
        data: "Public dataset: Credit Card Dataset for Clustering",
        role: "Solo analysis",
        period: "May 2026",
        stack: ["Python", "Pandas", "scikit-learn", "K-Means", "PCA"],
        summary:
            "K-Means on 17 standardised behavioural features, with the number of clusters chosen by silhouette score and the result read cautiously.",
        findings: [
            {
                value: "K = 3",
                label: "the best silhouette of K = 2–10, at 0.247",
                kind: "dataset",
                basis: "Silhouette on all 17 standardised features; a modest score, so segments overlap",
                source: "credit-card-customer-segmentation/segmentation.ipynb (cells 6–7)",
            },
            {
                value: "8,636",
                label: "customers clustered after dropping rows with missing values",
                kind: "dataset",
                basis: "8,950 rows in the raw file; 314 removed",
                source: "segmentation.ipynb (cells 2–3)",
            },
            {
                value: "68 / 18 / 14",
                label: "% split: moderate users · cash-advance heavy · high spenders",
                kind: "dataset",
                basis: "Cluster shares and mean-feature profiles",
                source: "segmentation.ipynb (cells 8, 10)",
            },
        ],
        repo: { public: true, url: "https://github.com/deepbanik0506-bit/credit-card-customer-segmentation" },
        caseStudy: "/work/segmentation/",
    },
];

export default projects;

export const getProject = (slug) => projects.find((p) => p.slug === slug);
