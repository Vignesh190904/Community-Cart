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
        if (count === 0 || maxCount === 0) return 'rgba(219,234,254,0.4)'; // light blue-50
        const intensity = count / maxCount;
        // gradient: light blue → deep blue
        const r = Math.round(219 - intensity * 160);
        const g = Math.round(234 - intensity * 124);
        const b = Math.round(254 - intensity * 12);
        return `rgb(${r},${g},${b})`;
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
