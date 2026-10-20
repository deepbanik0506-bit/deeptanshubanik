import React from "react";
import ReactDOM from "react-dom/client";
import CaseStudy from "./components/CaseStudy";
import "./styles/tokens.css";
import "./style.css";
import { Analytics } from "@vercel/analytics/react";

// The page is prerendered at build time (scripts/prerender.mjs); hydrate it.
ReactDOM.hydrateRoot(
    document.getElementById("root"),
    <React.StrictMode>
        <CaseStudy slug={document.body.dataset.slug} />
        <Analytics />
    </React.StrictMode>
);
