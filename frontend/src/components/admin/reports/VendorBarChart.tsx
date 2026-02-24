import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface VendorData {
    vendorId: string;
    name: string;
    revenue: number;
}

interface VendorBarChartProps {
    data: VendorData[];
    activeVendorId?: string;
    onSelect?: (vendorId: string) => void;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function VendorBarChart({ data, activeVendorId, onSelect }: VendorBarChartProps) {
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    return (
        <div className="chart-card">
            <h3>Revenue by Vendor</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sorted} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Bar
                        dataKey="revenue"
                        radius={[4, 4, 0, 0]}
                        cursor={onSelect ? 'pointer' : 'default'}
                        isAnimationActive={true}
                        animationDuration={400}
                        onClick={(data: any) => onSelect?.(data.vendorId)}
                    >
                        {sorted.map((entry, index) => (
                            <Cell
                                key={`${entry.vendorId}-${index}`}
                                fill={
                                    activeVendorId
                                        ? entry.vendorId === activeVendorId
                                            ? '#8b5cf6'
                                            : '#e5e7eb'
                                        : '#8b5cf6'
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
