import {
    AreaChart,
    Area,
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
                <AreaChart data={sorted} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        isAnimationActive={true}
                        animationDuration={500}
                        animationEasing="ease-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

