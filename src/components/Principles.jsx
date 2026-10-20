import Reveal from "./Reveal";
import { SectionHead } from "./Tags";
import { principles } from "../data/content";

function Principles() {
    return (
        <section className="section" id="principles" aria-labelledby="principles-title">
            <div className="shell">
                <SectionHead index={1} label="Principles" title="Working hypotheses, with evidence" id="principles-title">
                    <p>Four things I believe about building systems. Each one points to the place in the work where it was tested.</p>
                </SectionHead>
                <ol className="principles">
                    {principles.map((p, i) => (
                        <Reveal as="li" key={p.id} className="principle panel" delay={i * 0.05}>
                            <span className="principle-num" aria-hidden="true">
                                H{i + 1}
                            </span>
                            <p className="principle-statement">{p.statement}</p>
                            <p className="principle-evidence">{p.evidence}</p>
                            <a className="text-link" href={p.href}>
                                {p.linkLabel} <span aria-hidden="true">→</span>
                            </a>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export default Principles;
