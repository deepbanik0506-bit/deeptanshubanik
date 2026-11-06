import Reveal from "./Reveal";
import { SectionHead } from "./Tags";
import { certifications, experience } from "../data/content";
import portrait from "../assets/profile-campus-480.webp";

function Experience() {
    return (
        <section className="section" id="experience" aria-labelledby="experience-title">
            <div className="shell experience">
                <div className="experience-side">
                    <SectionHead index={4} label="Experience" title="Where the work happens" id="experience-title" />
                    <figure className="portrait">
                        <img src={portrait} alt="Portrait of Deeptanshu Banik" width="480" height="661" loading="lazy" decoding="async" />
                        <figcaption>
                            Curious. Experimental. Always building.
                        </figcaption>
                    </figure>
                </div>

                <div>
                    <ol className="timeline">
                        {experience.map((e, i) => (
                            <Reveal as="li" key={e.org} className="timeline-item" delay={i * 0.05}>
                                <p className="timeline-period">{e.period}</p>
                                <h3 className="timeline-title">{e.title}</h3>
                                {!e.title.includes(e.org) && <p className="timeline-org">{e.org}</p>}
                                {e.line && <p className="timeline-line">{e.line}</p>}
                                {e.points.length > 0 && (
                                    <ul className="timeline-points">
                                        {e.points.map((pt) => (
                                            <li key={pt}>{pt}</li>
                                        ))}
                                    </ul>
                                )}
                            </Reveal>
                        ))}
                    </ol>

                    <h3 className="bench-heading cert-heading">Certifications</h3>
                    <ul className="timeline">
                        {certifications.map((c, i) => (
                            <Reveal as="li" key={c.name} className="timeline-item" delay={i * 0.05}>
                                <p className="timeline-period">Issued {c.issued}</p>
                                <h4 className="timeline-title">{c.name}</h4>
                                <p className="timeline-org">{c.issuer}</p>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Experience;
