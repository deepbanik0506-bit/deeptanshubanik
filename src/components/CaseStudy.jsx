import { useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Shell from "./Shell";
import SystemDiagram from "./SystemDiagram";
import { DiscountChart, ShareChart, ThresholdChart } from "./Charts";
import { EvidenceTag, StatusTag } from "./Tags";
import { Findings, LayerToggles } from "./Work";
import projects, { getProject } from "../data/projects";
import caseStudies from "../data/caseStudies";
import useMediaQuery from "../hooks/useMediaQuery";

const SECTIONS = [
    ["problem", "Problem"],
    ["constraints", "Constraints"],
    ["architecture", "Architecture"],
    ["decisions", "Decisions"],
    ["implementation", "Implementation"],
    ["validation", "Validation"],
    ["results", "Results"],
    ["limitations", "Limitations"],
    ["lessons", "Lessons"],
];

const LAYERS = [
    ["Review dashboard", "talks to the API over HTTP only"],
    ["API", "FastAPI; reuses the engine, never duplicates it"],
    ["Recommendation · Document intake", "isolated peers; neither imports ingestion"],
    ["Ingestion pipeline", "page → evidence → parsers → LLM gaps → record"],
    ["Registry and onboarding gate", "decides what is trusted"],
];

function Plane({ index, gap, label, sub }) {
    const y = useTransform(gap, (g) => index * g);
    return (
        <m.li className="plane" style={{ y }}>
            <span className="plane-surface" aria-hidden="true" />
            <span className="plane-label">
                <strong>{label}</strong>
                <span>{sub}</span>
            </span>
        </m.li>
    );
}

// The exploded view: layers separate as the reader scrolls past them.
function LayerStack() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const wide = useMediaQuery("(min-width: 768px)");
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
    const spread = useTransform(scrollYProgress, [0, 1], [18, 84]);
    const fixed = useMotionValue(84);
    const gap = reduce || !wide ? fixed : spread;

    return (
        <figure className="layer-stack" ref={ref}>
            <ol className="planes" aria-label="OASIS layers, top to bottom">
                {LAYERS.map(([label, sub], i) => (
                    <Plane key={label} index={i} gap={gap} label={label} sub={sub} />
                ))}
            </ol>
            <figcaption>
                Code dependencies only point downward. Upper layers read the pipeline's output; none of them imports
                its code, and tests enforce that.
            </figcaption>
        </figure>
    );
}

function Section({ id, n, title, wide = false, children }) {
    return (
        <section className="cs-section" id={id} aria-labelledby={`${id}-title`}>
            <div className={`cs-main${wide ? " cs-main--wide" : ""}`}>
                <p className="section-index">
                    <span aria-hidden="true">{String(n).padStart(2, "0")}</span> {title}
                </p>
                <h2 id={`${id}-title`} className="sr-only">
                    {title}
                </h2>
                {children}
            </div>
        </section>
    );
}

function Decision({ d }) {
    return (
        <article className={`decision panel${d.revisited ? " decision--revisited" : ""}`}>
            {d.revisited && (
                <p className="margin-note">
                    <span className="margin-note-mark" aria-hidden="true">
                        ↺
                    </span>{" "}
                    Revisited: a decision I changed or corrected after the evidence moved.
                </p>
            )}
            <h3>{d.title}</h3>
            <p className="decision-choice">{d.choice}</p>
            <details className="decision-reasoning">
                <summary>Show reasoning</summary>
                <dl>
                    <div>
                        <dt>Context</dt>
                        <dd>{d.context}</dd>
                    </div>
                    <div>
                        <dt>Options considered</dt>
                        <dd>{d.options}</dd>
                    </div>
                    <div>
                        <dt>Trade-off accepted</dt>
                        <dd>{d.tradeoff}</dd>
                    </div>
                </dl>
            </details>
        </article>
    );
}

function Visual({ slug }) {
    if (slug === "discount-profitability") return <DiscountChart />;
    if (slug === "churn") return <ThresholdChart />;
    if (slug === "segmentation") return <ShareChart />;
    return null;
}

function CaseStudy({ slug }) {
    const p = getProject(slug) ?? projects[0];
    const cs = caseStudies[p.slug];
    const [layer, setLayer] = useState(null);
    const i = projects.indexOf(p);
    const next = projects[(i + 1) % projects.length];

    return (
        <Shell>
            <article className="cs">
                <header className="cs-header shell">
                    <nav aria-label="Breadcrumb" className="breadcrumb">
                        <a href="/#work">Work</a> <span aria-hidden="true">/</span> <span aria-current="page">{p.title}</span>
                    </nav>
                    <p className="card-meta">
                        <StatusTag status={p.status} tone={p.statusTone} />
                        {p.context && <span>{p.context}</span>}
                        <span>{p.period}</span>
                    </p>
                    <h1 className="cs-title">{p.title}</h1>
                    <p className="cs-oneline">{cs.oneLine}</p>
                    <dl className="cs-meta panel">
                        <div>
                            <dt>Role</dt>
                            <dd>{p.role}</dd>
                        </div>
                        <div>
                            <dt>Data</dt>
                            <dd>{p.data}</dd>
                        </div>
                        <div>
                            <dt>Stack</dt>
                            <dd>{p.stack.join(" · ")}</dd>
                        </div>
                        <div>
                            <dt>Source</dt>
                            <dd>
                                {p.repo.public ? (
                                    <>
                                        <a href={p.repo.url} target="_blank" rel="noopener noreferrer">
                                            Public repository<span className="sr-only"> (opens in a new tab)</span> ↗
                                        </a>
                                        {p.repo.secondary && (
                                            <>
                                                {" · "}
                                                <a href={p.repo.secondary} target="_blank" rel="noopener noreferrer">
                                                    earlier companion repo<span className="sr-only"> (opens in a new tab)</span> ↗
                                                </a>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    "Private"
                                )}
                            </dd>
                        </div>
                    </dl>
                    <p className="note-line">{cs.sourceNote}</p>
                    <nav className="cs-toc" aria-label="On this page">
                        <ol>
                            {SECTIONS.map(([id, label], n) => (
                                <li key={id}>
                                    <a href={`#${id}`}>
                                        <span aria-hidden="true">{String(n + 1).padStart(2, "0")}</span> {label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                </header>

                <div className="shell cs-body">
                    <Section id="problem" n={1} title="Problem">
                        {cs.problem.map((t) => (
                            <p key={t} className="cs-prose">
                                {t}
                            </p>
                        ))}
                    </Section>

                    <Section id="constraints" n={2} title="Constraints">
                        <dl className="constraints">
                            {cs.constraints.map(([k, v]) => (
                                <div key={k} className="panel">
                                    <dt>{k}</dt>
                                    <dd>{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </Section>

                    <Section id="architecture" n={3} title="Architecture" wide={p.slug === "oasis"}>
                        {cs.diagram.layers.length > 0 && (
                            <LayerToggles layers={cs.diagram.layers} active={layer} onChange={setLayer} />
                        )}
                        <div className="panel cs-diagram">
                            <SystemDiagram diagram={cs.diagram} activeLayer={layer} readoutAside={p.slug === "oasis"} />
                        </div>
                        <p className="caption">{cs.diagramCaption}</p>
                        {p.slug === "oasis" && <LayerStack />}
                    </Section>

                    <Section id="decisions" n={4} title="Key decisions">
                        <div className="decisions">
                            {cs.decisions.map((d) => (
                                <Decision key={d.title} d={d} />
                            ))}
                        </div>
                    </Section>

                    <Section id="implementation" n={5} title="Implementation">
                        <ul className="cs-list">
                            {cs.implementation.map((t) => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>
                    </Section>

                    <Section id="validation" n={6} title="Validation">
                        <dl className="constraints">
                            {cs.validation.map(([k, v]) => (
                                <div key={k} className="panel">
                                    <dt>{k}</dt>
                                    <dd>{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </Section>

                    <Section id="results" n={7} title="Results">
                        <Findings findings={p.findings} />
                        <ul className="results">
                            {cs.results.map((r) => (
                                <li key={r.text}>
                                    <EvidenceTag kind={r.kind} /> {r.text}
                                </li>
                            ))}
                        </ul>
                        <Visual slug={p.slug} />
                    </Section>

                    <Section id="limitations" n={8} title="Limitations">
                        <ul className="cs-list cs-list--caution">
                            {cs.limitations.map((t) => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>
                    </Section>

                    <Section id="lessons" n={9} title="Lessons">
                        <ul className="lessons">
                            {cs.lessons.map((t) => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>
                        <details className="discovery differently">
                            <summary>What I'd do differently</summary>
                            <ul className="cs-list">
                                {cs.differently.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </details>
                    </Section>

                    <section className="cs-sources" aria-labelledby="sources-title">
                        <h2 id="sources-title" className="section-index">
                            Where the numbers come from
                        </h2>
                        <ul>
                            {p.findings.map((f) => (
                                <li key={f.label}>
                                    <strong>{f.value}</strong> {f.label}. <span className="muted">{f.basis}.</span>{" "}
                                    <span className="source">
                                        {p.repo.public ? `Source: ${f.source}` : "Source: private repository, verified 18 Oct 2026"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <nav className="cs-next" aria-label="More work">
                        <a href="/#work" className="text-link">
                            ← All work
                        </a>
                        <a href={next.caseStudy} className="cs-next-link panel">
                            <span className="muted">Next case study</span>
                            <strong>{next.title}</strong>
                            <span>{next.subtitle} →</span>
                        </a>
                    </nav>
                </div>
            </article>
        </Shell>
    );
}

export default CaseStudy;
