import { identity } from "../data/content";

function SiteFooter() {
    return (
        <footer className="site-footer" id="contact" aria-labelledby="contact-title">
            <div className="shell footer-grid">
                <div>
                    <p className="section-index">
                        <span aria-hidden="true">5</span> Contact
                    </p>
                    <h2 id="contact-title" className="footer-title">
                        Have a problem that's more interesting than the technology? Let's talk.
                    </h2>
                    <a className="footer-email" href={`mailto:${identity.email}`}>
                        {identity.email}
                    </a>
                </div>
                <ul className="footer-links">
                    <li>
                        <a href={identity.links.github} target="_blank" rel="noopener noreferrer">
                            GitHub<span className="sr-only"> (opens in a new tab)</span> ↗
                        </a>
                    </li>
                    <li>
                        <a href={identity.links.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn<span className="sr-only"> (opens in a new tab)</span> ↗
                        </a>
                    </li>
                </ul>
            </div>
            <div className="shell footer-fine">
                <details className="discovery">
                    <summary>What's the faint pattern behind this page?</summary>
                    <p>
                        It's the OASIS module graph: the same registry, pipeline and serving layers as the architecture
                        diagram, drawn at low contrast. Every diagram on this site is real architecture, even the
                        decorative one.
                    </p>
                </details>
                <p>
                    © {new Date().getFullYear()} {identity.name}. Built with React and Vite.
                </p>
            </div>
        </footer>
    );
}

export default SiteFooter;
