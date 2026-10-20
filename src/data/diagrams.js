// Architecture diagrams, sanitised to module level. Every node maps to a real
// component in the source repository; nothing here is illustrative filler.
//
// Node kinds: "step" (deterministic code), "llm" (model call), "human"
// (a person decides), "store" (persisted data), "planned" (not built yet),
// "source" (external input).
// Edges default to "flow"; "control" is configuration or a decision,
// "fallback" is a conditional path.

const W = 158;
const H = 54;
const col = (i) => 24 + i * 194;

export const oasisDiagram = {
    id: "oasis",
    title: "OASIS architecture",
    viewBox: "0 0 1000 600",
    layers: [
        { id: "onboarding", label: "Onboarding" },
        { id: "ingestion", label: "Ingestion" },
        { id: "recommendation", label: "Recommendation" },
        { id: "intake", label: "Document intake" },
        { id: "api", label: "API & dashboard" },
    ],
    lanes: [
        { label: "Ingestion: page to structured record", x: 130, y: 150 },
        { label: "Serving: recommendations through an API", x: 130, y: 432 },
    ],
    nodes: [
        { id: "registry", layer: "onboarding", kind: "store", x: col(0), y: 40, label: "Registry", sub: "config per uni",
          note: "Per-university settings live in configuration, not code. A university's status (candidate or active) is a field here." },
        { id: "onboard", layer: "onboarding", kind: "step", x: col(1), y: 40, label: "Onboarding run", sub: "sample pipeline pass",
          note: "A new candidate gets a sample run through the real pipeline before anything is trusted." },
        { id: "gap", layer: "onboarding", kind: "step", x: col(2), y: 40, label: "Gap report", sub: "P0–P3 issues",
          note: "Missing or suspect fields are classified by severity, so effort goes to what blocks correctness first." },
        { id: "suggest", layer: "onboarding", kind: "human", x: col(3), y: 40, label: "Config suggestion", sub: "human approves diff",
          note: "The system drafts configuration changes. A person approves them; nothing is applied automatically." },
        { id: "gate", layer: "onboarding", kind: "step", x: col(4), y: 40, label: "Regression gate", sub: "promote/hold/reject",
          note: "Promotion to active is a manual registry edit, made only after a PROMOTE verdict. Current state: 0 promote, 3 hold, the rest reject." },

        { id: "discover", layer: "ingestion", kind: "step", x: col(0), y: 170, label: "Discover", sub: "find course pages",
          note: "Finds candidate course pages from listing pages using clustering and scoring heuristics." },
        { id: "fetch", layer: "ingestion", kind: "step", x: col(1), y: 170, label: "Fetch", sub: "static first",
          note: "Plain HTTP first. A headless browser is a scoped fallback, switched on per configuration, not the default." },
        { id: "validate", layer: "ingestion", kind: "step", x: col(2), y: 170, label: "Validate page", sub: "drop non-course",
          note: "Pages that aren't real course pages are skipped before any evidence is saved." },
        { id: "extract", layer: "ingestion", kind: "step", x: col(3), y: 170, label: "Extract", sub: "evidence saved",
          note: "Raw HTML and extracted text are stored as evidence, so every field can be traced back to its source page." },
        { id: "parse", layer: "ingestion", kind: "step", x: col(4), y: 170, label: "9 field parsers", sub: "deterministic",
          note: "Config-driven parsers for degree, duration, fees, modules, intakes, campus, study mode, language and entry requirements." },

        { id: "llm", layer: "ingestion", kind: "llm", x: col(4), y: 290, label: "LLM fill", sub: "only empty fields",
          note: "One narrowly scoped local-model call, given only the fields the parsers left empty." },
        { id: "merge", layer: "ingestion", kind: "step", x: col(3), y: 290, label: "Merge", sub: "deterministic wins",
          note: "If a parser found a value, the model's answer is discarded. The LLM can add facts; it can never overwrite them." },
        { id: "normalize", layer: "ingestion", kind: "step", x: col(2), y: 290, label: "Normalise", sub: "schema + canonical",
          note: "Schema validation plus canonical degree names, durations, intakes, campus names and currency." },
        { id: "diff", layer: "ingestion", kind: "step", x: col(1), y: 290, label: "Change detection", sub: "diff vs last run",
          note: "Each run is compared with the stored record, so changes on a university's site show up as a report." },
        { id: "records", layer: "ingestion", kind: "store", x: col(0), y: 290, label: "Structured records", sub: "one per programme",
          note: "One JSON record per programme. Duplicates are quarantined (moved, not deleted) with a manifest." },

        { id: "recommend", layer: "recommendation", kind: "step", x: col(0), y: 452, label: "Matching engine", sub: "explainable scoring",
          note: "Mandatory criteria plus weighted scoring, with every result explained. It never imports the ingestion code." },
        { id: "intake", layer: "intake", kind: "step", x: col(1), y: 530, label: "Document intake", sub: "transcript → profile",
          note: "Turns an uploaded transcript into the same profile shape a manual form produces. Isolated from every other module." },
        { id: "api", layer: "api", kind: "step", x: col(2), y: 452, label: "API", sub: "FastAPI",
          note: "Serves universities, courses and recommendations, with OpenAPI docs. It reuses the engine and never duplicates logic." },
        { id: "dashboard", layer: "api", kind: "step", x: col(3), y: 452, label: "Review dashboard", sub: "internal",
          note: "Internal UI for testing profiles against real records. It talks to the API over HTTP only." },
        { id: "product", layer: "api", kind: "planned", x: col(4), y: 452, label: "End-user product", sub: "not built yet",
          note: "No public product runs on OASIS yet. It is shown here so the diagram doesn't overstate what exists." },
    ],
    edges: [
        { from: "registry", to: "onboard", kind: "control" },
        { from: "onboard", to: "gap" },
        { from: "gap", to: "suggest" },
        { from: "suggest", to: "gate", kind: "control" },
        { from: "gate", to: "registry", kind: "control", path: "M 879 40 C 879 2, 103 2, 103 40", label: "promote: manual registry edit", labelAt: [491, 14] },
        { from: "registry", to: "discover", kind: "control" },
        { from: "discover", to: "fetch" },
        { from: "fetch", to: "validate" },
        { from: "validate", to: "extract" },
        { from: "extract", to: "parse" },
        { from: "parse", to: "llm", kind: "fallback", label: "nulls only" },
        { from: "llm", to: "merge" },
        { from: "merge", to: "normalize" },
        { from: "normalize", to: "diff" },
        { from: "diff", to: "records" },
        { from: "records", to: "recommend" },
        { from: "recommend", to: "api" },
        { from: "intake", to: "api", path: "M 376 557 L 491 557 L 491 506" },
        { from: "api", to: "dashboard" },
        { from: "dashboard", to: "product", kind: "fallback" },
    ],
    nodeSize: { w: W, h: H },
};

// Simplified spine for the hero: the same pipeline, reduced to the idea.
export const heroDiagram = {
    id: "hero",
    title: "How OASIS turns a web page into a trusted record",
    viewBox: "0 0 360 580",
    layers: [],
    nodes: [
        { id: "pages", kind: "source", x: 40, y: 16, label: "Official web pages", sub: "messy, inconsistent",
          note: "Input: public course pages, each university structured differently." },
        { id: "fetch", kind: "step", x: 40, y: 94, label: "Discover · fetch", sub: "static first",
          note: "Find course pages and fetch them, with a headless browser only as a scoped fallback." },
        { id: "validate", kind: "step", x: 40, y: 172, label: "Validate page", sub: "skip non-course pages",
          note: "Reject anything that isn't really a course page before saving evidence." },
        { id: "parse", kind: "step", x: 40, y: 250, label: "9 rule-based parsers", sub: "deterministic first",
          note: "Most fields are extracted by config-driven rules that are regression-tested." },
        { id: "llm", kind: "llm", x: 236, y: 306, w: 112, label: "Local LLM", sub: "gaps only",
          note: "The model only sees fields the rules left empty, and can never overwrite them." },
        { id: "merge", kind: "step", x: 40, y: 362, label: "Merge", sub: "rules always win",
          note: "Deterministic values take precedence over model output." },
        { id: "check", kind: "step", x: 40, y: 440, label: "Validate · normalise", sub: "schema · change report",
          note: "Every record is schema-checked, normalised and compared with the last run." },
        { id: "record", kind: "store", x: 40, y: 518, label: "Trusted record", sub: "feeds recommendations",
          note: "Structured records feed an explainable matching engine." },
    ],
    edges: [
        { from: "pages", to: "fetch" },
        { from: "fetch", to: "validate" },
        { from: "validate", to: "parse" },
        { from: "parse", to: "llm", kind: "fallback", path: "M 220 275 L 292 275 L 292 306" },
        { from: "llm", to: "merge", path: "M 292 356 L 292 387 L 220 387" },
        { from: "parse", to: "merge" },
        { from: "merge", to: "check" },
        { from: "check", to: "record" },
    ],
    nodeSize: { w: 180, h: 50 },
};

const linear = (id, title, steps) => ({
    id,
    title,
    viewBox: `0 0 1000 140`,
    layers: [],
    nodes: steps.map((s, i) => ({ id: `${id}-${i}`, x: col(i), y: 40, ...s })),
    edges: steps.slice(1).map((_, i) => ({ from: `${id}-${i}`, to: `${id}-${i + 1}` })),
    nodeSize: { w: W, h: H },
});

export const discountDiagram = linear("discount", "Analysis pipeline", [
    { kind: "source", label: "Public dataset", sub: "retail order lines", note: "The Sample Superstore dataset: US retail order lines with sales, discount and profit." },
    { kind: "step", label: "Clean · derive", sub: "pandas → SQLite", note: "Column clean-up, profit margin derived, loaded into SQLite for querying." },
    { kind: "step", label: "SQL questions", sub: "7 queries", note: "Loss-making products, discount buckets, category thresholds, revenue from loss-making lines." },
    { kind: "step", label: "Sensitivity", sub: "profit per level", note: "Mean profit and margin at every discrete discount level, overall and per category." },
    { kind: "store", label: "Dashboard", sub: "Tableau", note: "Findings summarised in one Tableau dashboard." },
]);

export const churnDiagram = linear("churn", "Modelling pipeline", [
    { kind: "source", label: "Synthetic data", sub: "100,000 rows", note: "A generated dataset: its relationships come from whoever generated it, not from real customers." },
    { kind: "step", label: "Encode", sub: "one-hot, 11 cols", note: "Categorical fields one-hot encoded; the ID dropped." },
    { kind: "step", label: "Split", sub: "80/20 stratified", note: "A stratified split keeps the 33% churn rate in both sets." },
    { kind: "step", label: "Model", sub: "weighted logit", note: "Class-weighted logistic regression, chosen for interpretability." },
    { kind: "store", label: "Threshold", sub: "0.5 vs 0.4", note: "Compares the cost of missed churners against false alarms." },
]);

export const segmentationDiagram = linear("segmentation", "Clustering pipeline", [
    { kind: "source", label: "Public dataset", sub: "8,950 card holders", note: "Credit Card Dataset for Clustering: 17 behavioural features per customer." },
    { kind: "step", label: "Clean · scale", sub: "8,636 rows", note: "Rows with missing values dropped; features standardised." },
    { kind: "step", label: "Choose K", sub: "elbow + silhouette", note: "K from 2 to 10 compared; K = 3 scored highest at 0.247." },
    { kind: "step", label: "K-Means", sub: "K = 3", note: "Clusters fitted on all 17 standardised features." },
    { kind: "store", label: "Profiles", sub: "PCA for viewing only", note: "Clusters described by mean features; PCA used only to plot them." },
]);
