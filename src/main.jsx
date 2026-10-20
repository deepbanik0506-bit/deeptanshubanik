import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./style.css";
import { Analytics } from "@vercel/analytics/react";

// The page is prerendered at build time (scripts/prerender.mjs); hydrate it.
ReactDOM.hydrateRoot(
    document.getElementById("root"),
    <React.StrictMode>
        <App />
        <Analytics />
    </React.StrictMode>
);
