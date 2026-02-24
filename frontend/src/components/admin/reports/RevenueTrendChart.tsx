import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface DataPoint {
    date: string;
    revenue: number;
}

interface RevenueTrendChartProps {
    data: DataPoint[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="chart-card full-width">
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sorted} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#3b82f6' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
