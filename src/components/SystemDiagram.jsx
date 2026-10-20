import { useMemo, useRef, useState } from "react";

const KIND_LABELS = {
    step: "Deterministic step",
    llm: "Model call",
    human: "Human decision",
    store: "Stored data",
    planned: "Not built",
    source: "Input",
};

const box = (n, size) => ({ x: n.x, y: n.y, w: n.w ?? size.w, h: n.h ?? size.h });

// Orthogonal routing between node boxes unless an edge supplies its own path.
function edgePath(a, b) {
    const acx = a.x + a.w / 2;
    const bcx = b.x + b.w / 2;
    if (Math.abs(a.y - b.y) < 1) {
        const cy = a.y + a.h / 2;
        return a.x < b.x ? `M ${a.x + a.w} ${cy} L ${b.x} ${cy}` : `M ${a.x} ${cy} L ${b.x + b.w} ${cy}`;
    }
    const down = b.y > a.y;
    const y1 = down ? a.y + a.h : a.y;
    const y2 = down ? b.y : b.y + b.h;
    if (Math.abs(acx - bcx) < 1) return `M ${acx} ${y1} L ${bcx} ${y2}`;
    const mid = (y1 + y2) / 2;
    return `M ${acx} ${y1} L ${acx} ${mid} L ${bcx} ${mid} L ${bcx} ${y2}`;
}

// Breadth-first depth from the first node, so the trace pulse follows the flow.
function depths(nodes, edges) {
    const depth = { [nodes[0].id]: 0 };
    const queue = [nodes[0].id];
    while (queue.length) {
        const id = queue.shift();
        for (const e of edges) {
            if (e.from === id && depth[e.to] === undefined && e.kind !== "control") {
                depth[e.to] = depth[id] + 1;
                queue.push(e.to);
            }
        }
    }
    return depth;
}

// readoutAside: the selected component's explanation sits in a panel beside the diagram whenever the diagram's own
// container is wide enough (a container query, so it works in any section), and below it otherwise.
function SystemDiagram({
    diagram,
    activeLayer = null,
    trace = false,
    traceKey = 0,
    listOnMobile = true,
    readoutAside = false,
    className = "",
}) {
    const { nodes, edges, nodeSize, viewBox, title } = diagram;
    const [selected, setSelected] = useState(null);
    const refs = useRef([]);

    const boxes = useMemo(
        () => Object.fromEntries(nodes.map((n) => [n.id, box(n, nodeSize)])),
        [nodes, nodeSize],
    );
    const depth = useMemo(() => depths(nodes, edges), [nodes, edges]);

    const inLayer = (id) => !activeLayer || nodes.find((n) => n.id === id)?.layer === activeLayer;
    const current = nodes.find((n) => n.id === selected);

    const onKeyDown = (e, i) => {
        const next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (next) {
            e.preventDefault();
            refs.current[(i + next + nodes.length) % nodes.length]?.focus();
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelected(nodes[i].id);
        }
    };

    return (
        <figure
            className={`diagram diagram--${diagram.id} ${listOnMobile ? "diagram--list-mobile" : ""} ${readoutAside ? "diagram--aside" : ""} ${className}`}
        >
            <div className="diagram-body">
                <div className="diagram-canvas">
                    <svg
                        viewBox={viewBox}
                        role="group"
                        aria-label={`${title}. Use arrow keys to move between components and Enter to read about one.`}
                        className={trace ? "is-tracing" : ""}
                        key={traceKey}
                    >
                        <defs>
                            {["flow", "control", "fallback"].map((k) => (
                                <marker
                                    key={k}
                                    id={`arrow-${diagram.id}-${k}`}
                                    viewBox="0 0 8 8"
                                    refX="7"
                                    refY="4"
                                    markerWidth="7"
                                    markerHeight="7"
                                    orient="auto-start-reverse"
                                >
                                    <path d="M 0 0 L 8 4 L 0 8 z" className={`arrow arrow--${k}`} />
                                </marker>
                            ))}
                        </defs>

                        {diagram.lanes?.map((l) => (
                            <text key={l.label} x={l.x} y={l.y} className="diagram-lane">
                                {l.label}
                            </text>
                        ))}

                        {edges.map((e, i) => {
                            const kind = e.kind ?? "flow";
                            const d = e.path ?? edgePath(boxes[e.from], boxes[e.to]);
                            const dim = activeLayer && !inLayer(e.from) && !inLayer(e.to);
                            const lit = selected && (e.from === selected || e.to === selected);
                            const a = boxes[e.from];
                            const b = boxes[e.to];
                            return (
                                <g key={i} className={`edge edge--${kind}${dim ? " is-dim" : ""}${lit ? " is-lit" : ""}`}>
                                    <path d={d} markerEnd={`url(#arrow-${diagram.id}-${kind})`} />
                                    {trace && kind !== "control" && (
                                        <path
                                            d={d}
                                            pathLength="1"
                                            className="edge-pulse"
                                            style={{ "--delay": `${(depth[e.from] ?? 0) * 0.32 + 0.4}s` }}
                                        />
                                    )}
                                    {e.label && (
                                        <text
                                            className="edge-label"
                                            x={e.labelAt ? e.labelAt[0] : a.x + a.w / 2 + 8}
                                            y={e.labelAt ? e.labelAt[1] : (a.y + a.h + b.y) / 2 + 4}
                                            textAnchor={e.labelAt ? "middle" : "start"}
                                        >
                                            {e.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {nodes.map((n, i) => {
                            const b = boxes[n.id];
                            const dim = activeLayer && !inLayer(n.id);
                            return (
                                <g
                                    key={n.id}
                                    ref={(el) => (refs.current[i] = el)}
                                    className={`node node--${n.kind}${dim ? " is-dim" : ""}${selected === n.id ? " is-selected" : ""}`}
                                    transform={`translate(${b.x} ${b.y})`}
                                    tabIndex={0}
                                    role="button"
                                    aria-pressed={selected === n.id}
                                    onClick={() => setSelected(n.id)}
                                    onKeyDown={(e) => onKeyDown(e, i)}
                                >
                                    <rect width={b.w} height={b.h} rx="3" />
                                    <path className="node-tick" d={`M 0 8 L 0 0 L 8 0 M ${b.w - 8} ${b.h} L ${b.w} ${b.h} L ${b.w} ${b.h - 8}`} />
                                    <text x="12" y="22" className="node-label">
                                        {n.label}
                                    </text>
                                    <text x="12" y="40" className="node-sub">
                                        {` ${n.sub}`}
                                    </text>
                                    <text className="node-kind-sr" x="0" y="0">{` (${KIND_LABELS[n.kind]})`}</text>
                                    {n.kind === "llm" && <circle cx={b.w - 12} cy="12" r="3.5" className="node-glyph" />}
                                    {n.kind === "human" && (
                                        <path d={`M ${b.w - 16} 16 l 4 -8 l 4 8 z`} className="node-glyph" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {listOnMobile && (
                    <ol className="diagram-list" aria-label={title}>
                        {nodes.map((n) => (
                            <li key={n.id} className={`diagram-item diagram-item--${n.kind}${activeLayer && !inLayer(n.id) ? " is-dim" : ""}`}>
                                <details>
                                    <summary>
                                        <span className="diagram-item-label">{n.label}</span>
                                        <span className="diagram-item-sub">{n.sub}</span>
                                    </summary>
                                    <p>
                                        <span className={`kind kind--${n.kind}`}>{KIND_LABELS[n.kind]}</span> {n.note}
                                    </p>
                                </details>
                            </li>
                        ))}
                    </ol>
                )}

                <div className={`diagram-readout${readoutAside ? " diagram-readout--aside" : ""}`} aria-live="polite">
                    {readoutAside ? (
                        <>
                            <span className="readout-eyebrow">Selected step</span>
                            {current ? (
                                <>
                                    <strong className="readout-title">{current.label}</strong>
                                    <span className={`kind kind--${current.kind}`}>{KIND_LABELS[current.kind]}</span>
                                    <span className="readout-sub">{current.sub}</span>
                                    <p className="readout-note">{current.note}</p>
                                </>
                            ) : (
                                <span className="diagram-hint">
                                    Select a step in the diagram, or focus it and press Enter, to see what it does.
                                </span>
                            )}
                        </>
                    ) : current ? (
                        <>
                            <span className={`kind kind--${current.kind}`}>{KIND_LABELS[current.kind]}</span>
                            <strong>{current.label}</strong>
                            <span>{current.note}</span>
                        </>
                    ) : (
                        <span className="diagram-hint">Select any component to see what it does.</span>
                    )}
                </div>

                <DiagramLegend kinds={[...new Set(nodes.map((n) => n.kind))]} />
            </div>
        </figure>
    );
}

function DiagramLegend({ kinds }) {
    return (
        <ul className="diagram-legend" aria-label="Legend">
            {kinds.map((k) => (
                <li key={k} className={`legend-item legend-item--${k}`}>
                    <span className="legend-swatch" aria-hidden="true" />
                    {KIND_LABELS[k]}
                </li>
            ))}
        </ul>
    );
}

export default SystemDiagram;
