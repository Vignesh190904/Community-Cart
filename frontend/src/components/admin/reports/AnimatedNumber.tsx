import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    formatter?: (val: number) => string;
}

export default function AnimatedNumber({
    value,
    duration = 600,
    formatter = (v) => v.toLocaleString('en-IN'),
}: AnimatedNumberProps) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const from = prevRef.current;
        const to = value;

        if (from === to) return;

        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * easeOut;

            setDisplay(current);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                prevRef.current = to;
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [value, duration]);

    return <>{formatter(display)}</>;
}
