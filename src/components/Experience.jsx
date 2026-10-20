import Reveal from "./Reveal";
import { SectionHead } from "./Tags";
import { experience, interests } from "../data/content";
import portrait from "../assets/profile-480.webp";

function Experience() {
    return (
        <section className="section" id="experience" aria-labelledby="experience-title">
            <div className="shell experience">
                <div className="experience-side">
                    <SectionHead index={4} label="Experience" title="Where the work happens" id="experience-title" />
                    <figure className="portrait">
                        <img src={portrait} alt="Portrait of Deeptanshu Banik" width="480" height="661" loading="lazy" decoding="async" />
                        <figcaption>
                            Deep. Drawn to how systems behave, seen through {interests.slice(0, -1).join(", ")} and{" "}
                            {interests.at(-1)}.
                        </figcaption>
                    </figure>
                </div>

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
            </div>
        </section>
    );
}

export default Experience;
