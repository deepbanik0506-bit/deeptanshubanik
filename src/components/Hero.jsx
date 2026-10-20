import { useState } from "react";
import SystemDiagram from "./SystemDiagram";
import { heroDiagram } from "../data/diagrams";
import { identity } from "../data/content";

const CHIPS = [
    { value: "858", text: "offline tests, run in CI on every change", href: "/work/oasis/#validation" },
    { value: "Rules first", text: "the LLM only fills fields rules leave empty", href: "/work/oasis/#decisions" },
    { value: "Human-approved", text: "config fixes: the system drafts them, a person approves each one", href: "/work/oasis/#decisions" },
];

// Entrance is CSS-only so the prerendered hero paints before any JavaScript runs.
const rise = (delay) => ({ "data-rise": "", style: { "--rise-delay": `${delay}s` } });

function Hero() {
    const [traceKey, setTraceKey] = useState(0);

    return (
        <section className="hero" id="top" aria-labelledby="hero-title">
            <div className="hero-grid shell">
                <div className="hero-copy">
                    <p className="eyebrow" {...rise(0)}>
                        {identity.name} · Agentic AI · Automation · Orchestration
                    </p>
                    <h1 id="hero-title" className="hero-title" {...rise(0.05)}>
                        I build AI workflows that hold up <em>after the demo.</em>
                    </h1>
                    <p className="hero-lede" {...rise(0.1)}>
                        {identity.lede}
                    </p>
                    <dl className="hero-meta" {...rise(0.15)}>
                        {identity.meta.map((item) => (
                            <div key={item.label}>
                                <dt>{item.label}</dt>
                                <dd>{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="hero-actions" {...rise(0.2)}>
                        <a className="btn btn--primary" href="#work">
                            See the work
                        </a>
                        <a className="btn" href="/work/oasis/">
                            OASIS case study
                        </a>
                        <a className="btn btn--quiet" href={`mailto:${identity.email}`}>
                            {identity.email}
                        </a>
                    </div>
                </div>

                <div className="hero-figure panel" {...rise(0.15)}>
                    <div className="panel-bar">
                        <span className="panel-title">Fig. 1: How OASIS turns a page into a trusted record</span>
                        <button className="trace-btn" onClick={() => setTraceKey((k) => k + 1)}>
                            Trace the flow
                        </button>
                    </div>
                    <SystemDiagram diagram={heroDiagram} trace traceKey={traceKey} listOnMobile={false} />
                </div>
            </div>

            <div className="shell">
                <ul className="evidence-chips" aria-label="Evidence">
                    {CHIPS.map((c) => (
                        <li key={c.value}>
                            <a href={c.href}>
                                <strong>{c.value}</strong>
                                <span>{c.text}</span>
                                <span className="chip-arrow" aria-hidden="true">
                                    →
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default Hero;
