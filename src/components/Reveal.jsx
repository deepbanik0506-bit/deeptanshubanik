import { m } from "framer-motion";

// Sections settle into place once as they arrive. MotionConfig's
// reducedMotion="user" strips the movement and keeps only the fade.
function Reveal({ as = "div", delay = 0, children, ...rest }) {
    const Tag = m[as];
    return (
        <Tag
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default Reveal;
