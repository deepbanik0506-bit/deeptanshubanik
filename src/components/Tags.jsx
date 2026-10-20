import { EVIDENCE_LABELS } from "../data/projects";

export function StatusTag({ status, tone }) {
    return <span className={`tag tag--status tag--${tone}`}>{status}</span>;
}

export function EvidenceTag({ kind }) {
    return <span className={`tag tag--evidence tag--${kind}`}>{EVIDENCE_LABELS[kind]}</span>;
}

export function SectionHead({ index, label, title, children, id }) {
    return (
        <header className="section-head">
            <p className="section-index">
                <span aria-hidden="true">{index}</span> {label}
            </p>
            <h2 id={id}>{title}</h2>
            {children && <div className="section-lede">{children}</div>}
        </header>
    );
}
