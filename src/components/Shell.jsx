import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import useMediaQuery from "../hooks/useMediaQuery";
import { oasisDiagram } from "../data/diagrams";

// The faint field behind every page is the OASIS module graph itself.
function BackgroundField() {
    const reduce = useReducedMotion();
    const wide = useMediaQuery("(min-width: 768px)");
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 4000], [0, -400]);
    const { nodes, edges, nodeSize } = oasisDiagram;
    const centre = (id) => {
        const n = nodes.find((x) => x.id === id);
        return [n.x + nodeSize.w / 2, n.y + nodeSize.h / 2];
    };

    return (
        <m.svg
            className="bg-field"
            viewBox="-40 -40 1080 680"
            preserveAspectRatio="xMidYMin slice"
            aria-hidden="true"
            style={reduce || !wide ? undefined : { y }}
        >
            {edges.map((e, i) => {
                const [x1, y1] = centre(e.from);
                const [x2, y2] = centre(e.to);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {nodes.map((n) => {
                const [cx, cy] = centre(n.id);
                return <circle key={n.id} cx={cx} cy={cy} r={n.kind === "llm" || n.kind === "human" ? 4 : 2.5} className={`bg-${n.kind}`} />;
            })}
        </m.svg>
    );
}

function Shell({ home = false, children }) {
    useEffect(() => {
        console.info(
            "%cHello, fellow reader of consoles.%c\nEvery diagram here is drawn from real architecture. The longest write-up is at /work/oasis/",
            "font-weight:600",
            "",
        );
    }, []);

    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">
                <BackgroundField />
                <SiteHeader home={home} />
                <main id="main" tabIndex={-1}>
                    {children}
                </main>
                <SiteFooter />
            </MotionConfig>
        </LazyMotion>
    );
}

export default Shell;
