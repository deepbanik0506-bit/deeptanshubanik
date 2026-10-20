import { useEffect, useState, useSyncExternalStore } from "react";
import logo from "../assets/db-logo-96.webp";
import { identity } from "../data/content";

const SECTIONS = [
    { id: "principles", label: "Principles" },
    { id: "work", label: "Work" },
    { id: "capabilities", label: "Capabilities" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
];

const LIGHT_QUERY = "(prefers-color-scheme: light)";

// The effective theme: an explicit choice on <html data-theme>, otherwise the OS preference.
function readTheme() {
    return document.documentElement.dataset.theme ?? (window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark");
}

function subscribeTheme(onChange) {
    const mql = window.matchMedia(LIGHT_QUERY);
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mql.addEventListener("change", onChange);
    return () => {
        observer.disconnect();
        mql.removeEventListener("change", onChange);
    };
}

// The icon shows the current theme (CSS picks it, so the prerendered markup is right before hydration);
// the accessible name says what pressing it does.
function ThemeToggle() {
    const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);
    const next = theme === "light" ? "dark" : "light";
    const label = theme ? `Switch to ${next} theme` : "Switch colour theme";

    const toggle = () => {
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {
            // Storage blocked: the choice still applies to this page.
        }
    };

    return (
        <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
            <svg className="theme-icon theme-icon--dark" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13.6 10.1A5.8 5.8 0 0 1 5.9 2.4a5.8 5.8 0 1 0 7.7 7.7z" />
            </svg>
            <svg className="theme-icon theme-icon--light" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M3.05 12.95l1.13-1.13M11.82 4.18l1.13-1.13" />
            </svg>
        </button>
    );
}

// Highlights the section currently in view (home page only).
function useActiveSection(enabled) {
    const [active, setActive] = useState(null);
    useEffect(() => {
        if (!enabled) return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [enabled]);
    return active;
}

function SiteHeader({ home = false }) {
    const [open, setOpen] = useState(false);
    const active = useActiveSection(home);
    const prefix = home ? "" : "/";

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="site-header">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <nav className="nav" aria-label="Primary">
                <a className="nav-logo" href={home ? "#top" : "/"} aria-label={`${identity.name}, home`}>
                    <img src={logo} alt="" width="40" height="32" />
                    <span className="nav-name">{identity.name}</span>
                </a>

                <div className="nav-end">
                    <button
                        className="nav-toggle"
                        aria-expanded={open}
                        aria-controls="nav-menu"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? "Close" : "Menu"}
                    </button>

                    <div id="nav-menu" className={`nav-menu${open ? " is-open" : ""}`}>
                        <ul className="nav-sections">
                            {SECTIONS.map((s, i) => (
                                <li key={s.id}>
                                    <a
                                        href={`${prefix}#${s.id}`}
                                        aria-current={active === s.id ? "location" : undefined}
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="nav-index" aria-hidden="true">
                                            {i + 1}
                                        </span>
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <ul className="nav-external">
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

                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}

export default SiteHeader;
