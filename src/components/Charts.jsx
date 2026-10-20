import { useState } from "react";
import { chartData } from "../data/caseStudies";

const fmt = (v) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1).replace("-", "−"));

function DataTable({ caption, head, rows }) {
    return (
        <details className="chart-table">
            <summary>Show the data as a table</summary>
            <table>
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        {head.map((h) => (
                            <th key={h} scope="col">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r[0]}>
                            {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    );
}

// Polarity: one series, coloured by sign, with the zero line as the anchor.
export function DiscountChart({ compact = false }) {
    const d = chartData.discount;
    const [hover, setHover] = useState(null);
    const W = 420, H = compact ? 150 : 230, L = compact ? 6 : 40, R = 8, T = 16, B = 28;
    const min = -320, max = 110;
    const y = (v) => T + ((max - v) / (max - min)) * (H - T - B);
    const step = (W - L - R) / d.points.length;
    const bw = Math.min(24, step - 6);
    const active = hover ?? 4;
    const [lvl, val] = d.points[active];

    return (
        <figure className={`chart${compact ? " chart--compact" : ""}`}>
            {!compact && <figcaption className="chart-title">{d.title}</figcaption>}
            <p className="chart-readout" aria-live="polite">
                <strong>{lvl}% discount</strong> mean profit {fmt(val)}
            </p>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${d.title}. Positive at 20% (+24.7), negative from 30% (−45.7).`}>
                {!compact &&
                    [-300, -200, -100, 0, 100].map((t) => (
                        <g key={t} className="chart-grid">
                            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
                            <text x={L - 8} y={y(t) + 4} textAnchor="end">
                                {t}
                            </text>
                        </g>
                    ))}
                {d.points.map(([level, v], i) => {
                    const x = L + i * step + (step - bw) / 2;
                    const top = v >= 0 ? y(v) : y(0);
                    const h = Math.abs(y(v) - y(0));
                    return (
                        <g key={level} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                            <rect className="chart-hit" x={L + i * step} y={T} width={step} height={H - T - B} />
                            <rect
                                className={`bar ${v >= 0 ? "bar--pos" : "bar--neg"}${i === active ? " is-active" : ""}`}
                                x={x}
                                y={top}
                                width={bw}
                                height={Math.max(h, 1)}
                                rx="2"
                            />
                            <text className="chart-axis" x={x + bw / 2} y={H - 8} textAnchor="middle">
                                {level}%
                            </text>
                        </g>
                    );
                })}
                <line className="chart-zero" x1={L} x2={W - R} y1={y(0)} y2={y(0)} />
            </svg>
            {!compact && (
                <>
                    <p className="chart-source">Source: {d.source}. Positive bars in blue, losses in red, signed values in the table.</p>
                    <DataTable
                        caption={d.title}
                        head={["Discount", "Mean profit per order line"]}
                        rows={d.points.map(([l, v]) => [`${l}%`, fmt(v)])}
                    />
                </>
            )}
        </figure>
    );
}

// Two series (thresholds) across three metrics: legend plus direct labels.
export function ThresholdChart({ compact = false }) {
    const d = chartData.churn;
    const W = 420, rowH = compact ? 40 : 48, L = 78, R = 48, T = 8;
    const H = T + d.rows.length * rowH;
    const x = (v) => L + (v / 100) * (W - L - R);
    return (
        <figure className={`chart${compact ? " chart--compact" : ""}`}>
            {!compact && <figcaption className="chart-title">{d.title}</figcaption>}
            <ul className="chart-legend">
                <li className="legend-s1">{d.a}</li>
                <li className="legend-s2">{d.b}</li>
            </ul>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${d.title}. Recall 70.1% to 81.6%, precision 52.2% to 48.0%, accuracy 68.8% to 64.6%.`}>
                {d.rows.map((r, i) => {
                    const y0 = T + i * rowH;
                    return (
                        <g key={r.label}>
                            <text className="chart-axis chart-axis--row" x={L - 10} y={y0 + rowH / 2 + 1} textAnchor="end">
                                {r.label}
                            </text>
                            {[["a", "bar--s1", 0], ["b", "bar--s2", 1]].map(([k, cls, j]) => (
                                <g key={k}>
                                    <rect className={`bar ${cls}`} x={L} y={y0 + 6 + j * (rowH / 2 - 4)} width={x(r[k]) - L} height={rowH / 2 - 10} rx="2" />
                                    <text className="chart-value" x={x(r[k]) + 6} y={y0 + 6 + j * (rowH / 2 - 4) + (rowH / 2 - 10) / 2 + 4}>
                                        {r[k].toFixed(1)}%
                                    </text>
                                </g>
                            ))}
                        </g>
                    );
                })}
            </svg>
            {!compact && (
                <>
                    <p className="chart-source">Source: {d.source}.</p>
                    <DataTable caption={d.title} head={["Metric", d.a, d.b]} rows={d.rows.map((r) => [r.label, `${r.a}%`, `${r.b}%`])} />
                </>
            )}
        </figure>
    );
}

// One series: share of customers per cluster, labelled directly.
export function ShareChart({ compact = false }) {
    const d = chartData.segmentation;
    const W = 420, rowH = compact ? 32 : 40, L = 132, R = 48, T = 4;
    const H = T + d.rows.length * rowH;
    const x = (v) => L + (v / 100) * (W - L - R);
    return (
        <figure className={`chart${compact ? " chart--compact" : ""}`}>
            {!compact && <figcaption className="chart-title">{d.title}</figcaption>}
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${d.title}: ${d.rows.map((r) => `${r.label} ${r.value}%`).join(", ")}.`}>
                {d.rows.map((r, i) => {
                    const y0 = T + i * rowH;
                    return (
                        <g key={r.label}>
                            <text className="chart-axis chart-axis--row" x={L - 10} y={y0 + rowH / 2 + 4} textAnchor="end">
                                {r.label}
                            </text>
                            <rect className="bar bar--s1" x={L} y={y0 + 8} width={x(r.value) - L} height={rowH - 16} rx="2" />
                            <text className="chart-value" x={x(r.value) + 6} y={y0 + rowH / 2 + 4}>
                                {r.value.toFixed(1)}%
                            </text>
                        </g>
                    );
                })}
            </svg>
            {!compact && (
                <>
                    <p className="chart-source">Source: {d.source}.</p>
                    <DataTable caption={d.title} head={["Segment", "Share"]} rows={d.rows.map((r) => [r.label, `${r.value}%`])} />
                </>
            )}
        </figure>
    );
}
