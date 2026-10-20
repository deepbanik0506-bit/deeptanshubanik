// Case-study content, following the template in REDESIGN_NOTES.md.
// Numbers here must match src/data/projects.js; sources are listed there.

import {
    oasisDiagram,
    discountDiagram,
    churnDiagram,
    segmentationDiagram,
} from "./diagrams";

const caseStudies = {
    oasis: {
        oneLine:
            "Structured, traceable course data from inconsistent official web pages, with a local LLM kept on a short leash.",
        sourceNote:
            "Source code is private. This page shows a sanitised architecture, documented decisions and test evidence.",
        problem: [
            "Course information is spread across official university pages that are each structured differently and change without notice. Comparing programmes usually means trusting data someone copied by hand, which is often already out of date.",
            "Scraping is the easy part. The hard part is knowing which extracted facts you can trust, and keeping that true as sites change.",
        ],
        constraints: [
            ["Local-first", "Runs on my own machine with a local model through Ollama, with no paid API dependency."],
            ["Facts beat fluency", "A model may fill gaps but must never overwrite a value the rules already extracted."],
            ["Traceable", "Official sources only. Raw pages are kept as evidence so every field can be traced back."],
            ["One developer", "Safety has to come from automated tests and gates, not from someone remembering to check."],
            ["Hostile inputs", "Some sites render client-side, some block automated access, and none share a structure."],
        ],
        diagram: oasisDiagram,
        diagramCaption:
            "Simplified from the repository's architecture document. Module names are generalised and internal paths omitted. Select a node, or use the arrow keys, to read what it does.",
        decisions: [
            {
                title: "Deterministic first, the LLM last",
                context: "Field values have to be right, not plausible. LLMs are good at reading messy pages and bad at admitting they don't know.",
                options: "LLM extraction for every field · rules only · rules first, with an LLM for what they miss",
                choice: "Nine config-driven parsers run first. One narrowly scoped local-model call sees only the fields they left empty, and the merge step always keeps the deterministic value.",
                tradeoff: "Slower to build, field by field, and some fields stay empty rather than guessed.",
            },
            {
                title: "Isolation enforced by tests, not convention",
                context: "Five modules (ingestion, recommendation, document intake, API and dashboard) could easily start reaching into each other.",
                options: "One package with good intentions · separate services · one repo with enforced boundaries",
                choice: "Static import-analysis tests fail if, for example, the recommendation engine ever imports ingestion code. The dashboard talks to the API over HTTP only.",
                tradeoff: "Interfaces have to be designed explicitly, even where a direct import would be quicker.",
            },
            {
                title: "A gate between “works on a sample” and “live”",
                context: "A new university that parses well on five pages can still be wrong on the fiftieth.",
                options: "Add universities once they run · manual review only · an automated verdict plus a human decision",
                choice: "An onboarding run produces a severity-ranked gap report. The system drafts config fixes that a person approves, and a regression gate returns PROMOTE, HOLD or REJECT. Promotion itself is a manual edit.",
                tradeoff: "Growth is slow on purpose: 4 universities are live, and none of the 46 candidates has been promoted yet.",
            },
            {
                title: "Revisited: no headless browser, then a scoped one",
                context: "The original design deliberately excluded headless rendering. Pages that only render client-side were out of scope, and one university was left out for exactly that reason.",
                options: "Keep the exclusion · switch to headless everywhere · add a fallback behind configuration",
                choice: "As the candidate list grew and many returned zero courses, the argument for headless got stronger, so I changed my mind. I added it as a config-gated fallback and then measured it against 18 zero-discovery candidates.",
                tradeoff: "Result: 5 of 18 newly produced courses (3 because of headless, 2 through static discovery on a fresh run), 4 were confirmed blocked, and 9 still found nothing despite a real browser render. The assumption behind the fix was only partly right, and the measurement showed which part.",
                revisited: true,
            },
            {
                title: "Quarantine, don't delete",
                context: "Duplicate programme records appeared after file-naming drift between runs.",
                options: "Delete duplicates · ignore them · move them aside with a manifest",
                choice: "Confirmed duplicates (12 groups, 17 files) were moved to a quarantine folder with a manifest. Two suspected groups turned out to be an extraction bug, which was fixed instead.",
                tradeoff: "Permanent deletion is still a pending follow-up, but nothing was lost on a false positive.",
            },
        ],
        implementation: [
            "Python pipeline: discover → fetch (static, with a headless fallback) → validate → extract and save evidence → 9 field parsers → LLM gap-fill → merge → validate and normalise → change detection → store.",
            "Explainable matching engine with mandatory criteria and weighted scoring, exposed through a FastAPI service with OpenAPI docs.",
            "Document intake that turns a transcript into the same profile shape a manual form produces, isolated from every other module.",
            "University registry and onboarding framework: per-university JSON config, gap reports, human-approved config suggestions and the regression gate.",
        ],
        validation: [
            ["858 offline tests", "Test methods across 46 files, run with Python's unittest. No real network or LLM calls, and fixtures copied from real fetched pages."],
            ["CI on every change", "GitHub Actions runs the suite on pushes and pull requests. The most recent run, on 17 Aug 2026, passed."],
            ["Boundaries are tests", "Layer isolation is checked by static import analysis, not code review."],
            ["Where it started", "An early internal audit recorded 24 tests in 2 files and no CI. Writing that down is what turned a working demo into a project with a reliability bar."],
        ],
        results: [
            { kind: "engineering", text: "5 isolated modules, 9 deterministic field parsers, and an API with documented endpoints." },
            { kind: "observed", text: "4 universities live. 46 candidates in onboarding, of which the gate currently holds 3 and rejects the rest." },
        ],
        limitations: [
            "No public end-user product runs on OASIS yet.",
            "Only 4 universities are live, so every “general” heuristic has been proven against a small set of sites.",
            "9 candidate sites still yield nothing even with a headless browser; the cause is not yet diagnosed.",
            "Some sites block automated access outright, and the system respects that rather than working around it.",
            "Quarantined duplicates are still awaiting permanent deletion.",
        ],
        lessons: [
            "Put the model where rules run out, and make sure it can't overwrite them.",
            "A gate that says “no” most of the time is doing its job.",
            "When you reverse a decision, measure the assumption behind the reversal too.",
        ],
        differently: [
            "Write decision records as decisions happen. The repository's decisions folder is still empty, and the reasoning lives in design documents instead.",
            "Test the most heuristic code first. The early audit found that discovery and layout detection, the riskiest parts, had no tests at all.",
        ],
    },

    "discount-profitability": {
        oneLine: "Discounts can make revenue look healthy while profit drains away. Where exactly does that start?",
        sourceNote: "Public dataset. Two earlier repositories are merged into this one case study.",
        problem: [
            "Discounting lifts revenue, so a business can look like it's growing while its margins erode. The commercial question is specific: at what discount level does an order stop making money, and which parts of the catalogue carry the losses?",
        ],
        constraints: [
            ["Public data", "The Sample Superstore retail dataset, with profit given rather than built up from costs."],
            ["Observational", "Historical orders, not an experiment, so this shows association rather than cause."],
            ["Two overlapping studies", "Two earlier repositories asked nearly the same question; they are merged here and their numbers reconciled."],
        ],
        diagram: discountDiagram,
        diagramCaption: "The analysis as built: SQL for the questions, pandas for sensitivity, Tableau for communication.",
        chart: "discount",
        decisions: [
            {
                title: "Exact discount levels, not buckets",
                context: "The two earlier write-ups disagreed: one said losses start “beyond 20–30%”, the other “around 30%”.",
                options: "Keep the bucket chart · report per discrete discount level",
                choice: "The dataset uses discrete discount values, so profit is reported at each one. The disagreement disappears: average profit is still positive at 20% and negative from 30%. The 20–30% bucket simply contained the 30% orders.",
                tradeoff: "Some levels have few orders, so their averages are noisy.",
                revisited: true,
            },
            {
                title: "State the denominator",
                context: "“About 20% loss-making” and “about 35% loss-making” had both been quoted in earlier materials.",
                options: "Pick the more striking number · name what's being counted",
                choice: "The figure reported here is a share of revenue: about 20% of sales came from order lines with negative profit. The 35% figure could not be traced to any saved analysis, so it is not used.",
                tradeoff: "A less dramatic headline, but a defensible one.",
            },
            {
                title: "No invented upside",
                context: "An earlier version reported a “~25% simulated profit improvement”.",
                options: "Keep it, labelled simulated · drop it",
                choice: "That scenario rested on an assumed rule (halving profit on lines discounted above 20%), not a model of customer behaviour, so it is not reported here.",
                tradeoff: "No headline improvement figure.",
            },
        ],
        implementation: [
            "pandas clean-up and derived margin, loaded into SQLite.",
            "Seven SQL queries: loss-making products, discount buckets, category thresholds and revenue from loss-making lines.",
            "A pandas sensitivity analysis of mean profit and margin per discount level, overall and per category.",
            "A Tableau dashboard summarising the findings.",
        ],
        validation: [
            ["Cross-checked", "Every number on this page appears in a saved notebook output or the published dashboard."],
            ["Reconciled", "Conflicting figures in earlier materials were traced to buckets and denominators, or dropped."],
        ],
        results: [
            { kind: "dataset", text: "Mean profit per order line: +24.7 at 20% discount and −45.7 at 30%, falling to −310.7 at 50%." },
            { kind: "dataset", text: "About 20% of revenue (19.86%) came from loss-making order lines." },
            { kind: "dataset", text: "Furniture has the weakest margin. Its average margin goes from +7.2% at 20% discount to −12.1% at 30%." },
        ],
        limitations: [
            "Correlation, not causation: discounts may be applied to products that were already struggling.",
            "A single public sample dataset, not a real business's books.",
            "Sparse discount levels make some averages unstable.",
        ],
        lessons: [
            "Bucket edges can manufacture disagreements. Look at the raw levels.",
            "A number without its denominator isn't a finding.",
        ],
        differently: [
            "Estimate the discount effect within each product, so product mix doesn't masquerade as a discount effect.",
        ],
        image: true,
    },

    churn: {
        oneLine: "The useful question isn't whether a model can predict churn, but how many false alarms you'll pay for to catch a churner.",
        sourceNote: "Synthetic dataset. These results describe a generated dataset, not real customers.",
        problem: [
            "A retention team can only contact so many customers. A churn model is only useful if its operating point matches that capacity: how many genuine churners it catches against how many loyal customers it flags by mistake.",
        ],
        constraints: [
            ["Synthetic data", "100,000 generated telecom customers. Any pattern found was put there by whoever generated the data."],
            ["Imbalanced classes", "33% of rows are churners."],
            ["Interpretability", "The point was to understand the trade-off, not to win a leaderboard."],
        ],
        diagram: churnDiagram,
        diagramCaption: "The modelling pipeline as built.",
        chart: "churn",
        decisions: [
            {
                title: "Logistic regression with class weights",
                context: "One in three rows is a churner, and the drivers need to be readable.",
                options: "Tree ensembles · plain logistic regression · class-balanced logistic regression",
                choice: "Class-balanced logistic regression on one-hot encoded features, with a stratified 80/20 split.",
                tradeoff: "Likely leaves accuracy on the table compared with more flexible models, which weren't tried.",
            },
            {
                title: "Treat the threshold as a business setting",
                context: "The default 0.5 cut-off is a convention, not a decision.",
                options: "Report 0.5 only · compare operating points",
                choice: "Comparing 0.5 and 0.4: recall rises from 70% to 82% while precision falls from 52% to 48%.",
                tradeoff: "The threshold was compared on the test set itself; a separate validation split would be cleaner.",
            },
        ],
        implementation: [
            "pandas encoding, a scikit-learn stratified split, and class-weighted logistic regression.",
            "Accuracy, precision, recall, F1 and ROC AUC at two thresholds, plus coefficient inspection.",
        ],
        validation: [
            ["Hold-out", "20% stratified test split: 20,000 rows."],
            ["Disclosed", "The dataset is synthetic, and that's stated wherever this project appears."],
        ],
        results: [
            { kind: "dataset", text: "At 0.5: accuracy 68.8%, precision 52.2%, recall 70.1%, ROC AUC 0.77." },
            { kind: "dataset", text: "At 0.4: recall 81.6% and precision 48.0%; accuracy drops to 64.6%." },
            { kind: "dataset", text: "Contract type dominates: one- and two-year contracts carry the largest negative coefficients, so month-to-month is the highest-risk group." },
        ],
        limitations: [
            "Synthetic data: the “drivers” are properties of the generator.",
            "Features weren't scaled, so coefficient sizes aren't comparable across features, and the solver raised numerical warnings.",
            "No baseline or alternative model was compared.",
        ],
        lessons: [
            "Model metrics only matter at an operating point someone has chosen.",
            "Know where your data came from before you believe what it says.",
        ],
        differently: [
            "Scale features, pick the threshold on a validation split, and compare against a simple baseline.",
        ],
    },

    segmentation: {
        oneLine: "Finding customer segments, and being honest about how distinct they really are.",
        sourceNote: "Public dataset. The figures here come from the committed notebook.",
        problem: [
            "Marketing teams like segments: a few named groups with different strategies. The prior question is whether the data really contains distinct groups, or whether segmentation is imposing structure on a continuum.",
        ],
        constraints: [
            ["Public data", "Credit Card Dataset for Clustering: 8,950 card holders and 17 behavioural features."],
            ["No labels", "There is no ground truth, so internal measures are all there is."],
        ],
        diagram: segmentationDiagram,
        diagramCaption: "The clustering pipeline as built.",
        chart: "segmentation",
        decisions: [
            {
                title: "Choose K by silhouette, and read the score",
                context: "The elbow plot was ambiguous.",
                options: "Pick a convenient K · choose by silhouette across K = 2–10",
                choice: "K = 3 had the highest silhouette, 0.247. That's a modest score: the segments are real tendencies with overlapping edges, not clean groups.",
                tradeoff: "Less tidy segments than a slide deck would like.",
            },
            {
                title: "PCA for viewing, not for scoring",
                context: "An earlier write-up compared a silhouette score in the full 17-dimensional space (0.28) with one in a 2-D PCA projection (0.37) and called it an improvement.",
                options: "Report the higher number · compare like with like",
                choice: "Scores in different spaces aren't comparable, so PCA is used here only to plot clusters. That earlier write-up also described a different run (K = 2); this page reports only what the committed notebook shows.",
                tradeoff: "A smaller headline number.",
                revisited: true,
            },
        ],
        implementation: [
            "Dropped rows with missing values (314 of 8,950) and standardised all 17 features.",
            "Elbow and silhouette comparison for K = 2–10, then K-Means with K = 3.",
            "Cluster profiles from mean features, with a 2-D PCA projection for visualisation.",
        ],
        validation: [
            ["Internal only", "Silhouette and elbow; no external labels exist."],
            ["Reconciled", "Earlier materials quoted K = 2 and K = 3. The committed notebook uses K = 3, which is what's reported here."],
        ],
        results: [
            { kind: "dataset", text: "68% moderate users: lower balances and modest purchases." },
            { kind: "dataset", text: "18% cash-advance heavy: average balance of about 4,000 and cash advances of about 3,900." },
            { kind: "dataset", text: "14% high spenders: average purchases of about 4,300." },
        ],
        limitations: [
            "A silhouette of 0.247 means substantial overlap between segments.",
            "K-Means assumes compact, similarly sized clusters, and the 68% cluster suggests that assumption is strained.",
            "Rows with missing values were dropped without checking whether they differ.",
        ],
        lessons: [
            "Only compare a metric with itself under the same conditions.",
            "“Segments exist” is a claim that needs evidence, not a starting assumption.",
        ],
        differently: [
            "Try a density- or mixture-based method and check the segments' stability across resamples.",
        ],
    },
};

export default caseStudies;

// Verified chart series (sources in projects.js).
export const chartData = {
    discount: {
        title: "Mean profit per order line, by discount level",
        unit: "",
        source: "discount_analysis.ipynb, cell 2 output",
        points: [
            [0, 66.9], [10, 96.1], [15, 27.3], [20, 24.7], [30, -45.7], [32, -88.6],
            [40, -111.9], [45, -226.6], [50, -310.7], [60, -43.1], [70, -95.9], [80, -101.8],
        ],
    },
    churn: {
        title: "The same model at two thresholds (test set, n = 20,000)",
        source: "notebook.ipynb, cells 6–7",
        rows: [
            { label: "Recall", a: 70.1, b: 81.6 },
            { label: "Precision", a: 52.2, b: 48.0 },
            { label: "Accuracy", a: 68.8, b: 64.6 },
        ],
        a: "threshold 0.5",
        b: "threshold 0.4",
    },
    segmentation: {
        title: "Cluster share of 8,636 customers (K = 3)",
        source: "segmentation.ipynb, cell 10",
        rows: [
            { label: "Moderate users", value: 67.8 },
            { label: "Cash-advance heavy", value: 18.1 },
            { label: "High spenders", value: 14.0 },
        ],
    },
};
