import { useState } from "react";
import Reveal from "./Reveal";
import SystemDiagram from "./SystemDiagram";
import { ShareChart, ThresholdChart } from "./Charts";
import { EvidenceTag, SectionHead, StatusTag } from "./Tags";
import projects, { getProject } from "../data/projects";
import { oasisDiagram } from "../data/diagrams";

const VISUALS = {
    churn: () => <ThresholdChart compact />,
    segmentation: () => <ShareChart compact />,
};

export function Findings({ findings }) {
    return (
        <ul className="findings">
            {findings.map((f) => (
                <li key={f.label} className="finding">
                    <span className="finding-value">{f.value}</span>
                    <span className="finding-label">{f.label}</span>
                    <EvidenceTag kind={f.kind} />
                </li>
            ))}
        </ul>
    );
}

export function LayerToggles({ layers, active, onChange }) {
    return (
        <div className="toggles" role="group" aria-label="Highlight a layer">
            <button aria-pressed={active === null} onClick={() => onChange(null)}>
                All layers
            </button>
            {layers.map((l) => (
                <button key={l.id} aria-pressed={active === l.id} onClick={() => onChange(l.id)}>
                    {l.label}
                </button>
            ))}
        </div>
    );
}

function Featured() {
    const p = getProject("oasis");
    const [layer, setLayer] = useState(null);
    return (
        <Reveal as="article" className="featured panel" aria-labelledby="featured-title">
            <div className="featured-head">
                <div>
                    <p className="card-meta">
                        <StatusTag status={p.status} tone={p.statusTone} />
                        <span>{p.context}</span>
                        <span>{p.period}</span>
                    </p>
                    <h3 id="featured-title" className="featured-title">
                        {p.title} <span>{p.subtitle}</span>
                    </h3>
                    <p className="featured-summary">{p.summary}</p>
                    <p className="note-line">
                        Source code is private. Architecture and evidence are shown; no company-internal information is.
                    </p>
                </div>
                <Findings findings={p.findings} />
            </div>
            <LayerToggles layers={oasisDiagram.layers} active={layer} onChange={setLayer} />
            <SystemDiagram diagram={oasisDiagram} activeLayer={layer} readoutAside />
            <a className="btn btn--primary featured-cta" href={p.caseStudy}>
                Read the OASIS case study
            </a>
        </Reveal>
    );
}

function BenchCard({ p, index }) {
    const visual = VISUALS[p.slug]?.();
    return (
        <Reveal as="article" className="bench-card panel" delay={(index % 2) * 0.06} aria-labelledby={`card-${p.slug}`}>
            <p className="card-meta">
                <StatusTag status={p.status} tone={p.statusTone} />
                <span>{p.period}</span>
            </p>
            <h3 id={`card-${p.slug}`} className="bench-title">
                <a href={p.caseStudy}>{p.title}</a>
            </h3>
            <p className="bench-subtitle">{p.subtitle}</p>
            <p className="data-line">
                <span className="data-line-label">Data</span> {p.data}
            </p>
            <p className="bench-summary">{p.summary}</p>
            {visual && (
                <div className="bench-visual" aria-hidden="true">
                    {visual}
                </div>
            )}
            <Findings findings={p.findings} />
            <p className="stack">{p.stack.join(" · ")}</p>
            <div className="card-links">
                <a className="text-link" href={p.caseStudy}>
                    Case study <span aria-hidden="true">→</span>
                </a>
                {p.repo.public ? (
                    <a className="text-link" href={p.repo.url} target="_blank" rel="noopener noreferrer">
                        Repository<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
                    </a>
                ) : (
                    <span className="muted">Source private</span>
                )}
            </div>
        </Reveal>
    );
}

function Work() {
    const bench = projects.filter((p) => p.slug !== "oasis");
    return (
        <section className="section" id="work" aria-labelledby="work-title">
            <div className="shell">
                <SectionHead index={2} label="Work" title="Systems, prototypes and studies" id="work-title">
                    <p>
                        Each project is labelled by maturity and by where its evidence comes from: the codebase, real use,
                        or a dataset. Nothing here is a business outcome unless it says so, and none currently does.
                    </p>
                </SectionHead>
                <Featured />
                <h3 className="bench-heading">The bench</h3>
                <div className="bench">
                    {bench.map((p, i) => (
                        <BenchCard key={p.slug} p={p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Work;
