import { useState } from "react";
import Reveal from "./Reveal";
import { SectionHead } from "./Tags";
import { capabilities } from "../data/content";
import caseStudyProjects, { linkedProjects } from "../data/projects";

// Case-study projects plus linked projects (no /work/ page), which link to their card on the home page.
const projects = [...caseStudyProjects, ...linkedProjects];
const getProject = (slug) => projects.find((p) => p.slug === slug);
const projectHref = (p) => p.caseStudy ?? `/#${p.slug}`;

const CAP_ROW = 64;
const HEIGHT = capabilities.length * CAP_ROW;
const PROJ_ROW = HEIGHT / projects.length;

function CapabilityMap() {
    const [active, setActive] = useState(capabilities[0].id);
    const cap = capabilities.find((c) => c.id === active);

    return (
        <section className="section" id="capabilities" aria-labelledby="capabilities-title">
            <div className="shell">
                <SectionHead index={3} label="Capabilities" title="What I can do, and where it's proven" id="capabilities-title">
                    <p>No self-rated skill bars. Select a capability to see which projects demonstrate it.</p>
                </SectionHead>

                <Reveal className="capmap panel" style={{ "--cap-h": `${HEIGHT}px` }}>
                    <ul className="capmap-caps" aria-label="Capabilities">
                        {capabilities.map((c) => (
                            <li key={c.id} style={{ height: CAP_ROW }}>
                                <button
                                    aria-pressed={active === c.id}
                                    onClick={() => setActive(c.id)}
                                    onMouseEnter={() => setActive(c.id)}
                                    onFocus={() => setActive(c.id)}
                                >
                                    {c.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <svg
                        className="capmap-edges"
                        viewBox={`0 0 100 ${HEIGHT}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {capabilities.flatMap((c, i) =>
                            c.projects.map((slug) => {
                                const j = projects.findIndex((p) => p.slug === slug);
                                const y1 = i * CAP_ROW + CAP_ROW / 2;
                                const y2 = j * PROJ_ROW + PROJ_ROW / 2;
                                return (
                                    <path
                                        key={`${c.id}-${slug}`}
                                        d={`M 0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`}
                                        className={c.id === active ? "is-lit" : ""}
                                        vectorEffect="non-scaling-stroke"
                                    />
                                );
                            }),
                        )}
                    </svg>

                    <ul className="capmap-projects" aria-label="Projects">
                        {projects.map((p) => {
                            const lit = cap.projects.includes(p.slug);
                            return (
                                <li key={p.slug} style={{ height: PROJ_ROW }} className={lit ? "is-lit" : ""}>
                                    <a href={projectHref(p)}>
                                        {p.title}
                                        {lit && <span className="sr-only"> (demonstrates {cap.label})</span>}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <p className="capmap-detail" aria-live="polite">
                        <strong>{cap.label}.</strong> {cap.detail} Shown in{" "}
                        {cap.projects.map((slug, i) => (
                            <span key={slug}>
                                {i > 0 && (i === cap.projects.length - 1 ? " and " : ", ")}
                                <a href={projectHref(getProject(slug))}>{getProject(slug).title}</a>
                            </span>
                        ))}
                        .
                    </p>
                </Reveal>

                <ul className="caplist">
                    {capabilities.map((c) => (
                        <li key={c.id} className="caplist-item panel">
                            <h3>{c.label}</h3>
                            <p>{c.detail}</p>
                            <p className="caplist-projects">
                                {c.projects.map((slug) => (
                                    <a key={slug} className="chip" href={projectHref(getProject(slug))}>
                                        {getProject(slug).title}
                                    </a>
                                ))}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default CapabilityMap;
