import Shell from "./components/Shell";
import Hero from "./components/Hero";
import Principles from "./components/Principles";
import Work from "./components/Work";
import CapabilityMap from "./components/CapabilityMap";
import Experience from "./components/Experience";

function App() {
    return (
        <Shell home>
            <Hero />
            <Principles />
            <Work />
            <CapabilityMap />
            <Experience />
        </Shell>
    );
}

export default App;
