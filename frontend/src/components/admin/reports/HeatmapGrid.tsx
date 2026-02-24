import { Fragment } from 'react';

interface HeatmapEntry {
    day: number;
    hour: number;
    count: number;
}

interface HeatmapGridProps {
    data: HeatmapEntry[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HeatmapGrid({ data }: HeatmapGridProps) {
    // Build a 7x24 lookup map
    const lookup: Record<string, number> = {};
    let maxCount = 0;

    for (const entry of data) {
        const key = `${entry.day}-${entry.hour}`;
        lookup[key] = (lookup[key] ?? 0) + entry.count;
        if (lookup[key] > maxCount) maxCount = lookup[key];
    }

    const getColor = (count: number): string => {
        if (count === 0 || maxCount === 0) return '#f1f5f9';

        const intensity = count / maxCount;

        const start = { r: 219, g: 234, b: 254 }; // #dbeafe
        const end = { r: 29, g: 78, b: 216 };     // #1d4ed8

        const r = Math.round(start.r + (end.r - start.r) * intensity);
        const g = Math.round(start.g + (end.g - start.g) * intensity);
        const b = Math.round(start.b + (end.b - start.b) * intensity);

        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="heatmap-container">
            <h3>Order Activity Heatmap (Day × Hour)</h3>
            <div className="heatmap-grid-wrapper">
                {/* Hour labels row */}
                <div className="heatmap-hour-labels">
                    <div className="heatmap-hour-label" /> {/* spacer for day label column */}
                    {Array.from({ length: 24 }, (_, h) => (
                        <div className="heatmap-hour-label" key={h}>
                            {h % 6 === 0 ? `${h}h` : ''}
                        </div>
                    ))}
                </div>

                {/* 7 day rows */}
                <div className="heatmap-grid">
                    {DAY_LABELS.map((day, dayIndex) => (
                        <Fragment key={dayIndex}>
                            <div className="heatmap-label">
                                {day}
                            </div>
                            {Array.from({ length: 24 }, (_, hour) => {
                                const key = `${dayIndex}-${hour}`;
                                const count = lookup[key] ?? 0;
                                return (
                                    <div
                                        key={key}
                                        className="heatmap-cell"
                                        style={{ backgroundColor: getColor(count) }}
                                        title={`${day} ${hour}:00 — ${count} orders`}
                                    />
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
