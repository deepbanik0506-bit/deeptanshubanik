import { renderToString } from "react-dom/server";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import CaseStudy from "./components/CaseStudy";

// Build-time prerender: the same trees main.jsx and case.jsx hydrate.
export function render(slug) {
    return renderToString(
        <>
            {slug ? <CaseStudy slug={slug} /> : <App />}
            <Analytics />
        </>,
    );
}
