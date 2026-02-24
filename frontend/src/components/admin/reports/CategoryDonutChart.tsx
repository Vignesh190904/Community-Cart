import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryData {
    category: string;
    revenue: number;
}

interface CategoryDonutChartProps {
    data: CategoryData[];
    activeCategory?: string;
    onSelect?: (category: string) => void;
}

const COLORS = ['#ec4899', '#f97316', '#8b5cf6', '#14b8a6', '#3b82f6', '#f59e0b', '#22c55e', '#06b6d4'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function CategoryDonutChart({ data, activeCategory, onSelect }: CategoryDonutChartProps) {
    const sorted = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    return (
        <div className="chart-card">
            <h3>Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={sorted}
                        dataKey="revenue"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        cursor={onSelect ? 'pointer' : 'default'}
                        isAnimationActive={true}
                        animationDuration={400}
                        onClick={(data: any) => onSelect?.(data.payload?.category ?? data.category)}
                    >
                        {sorted.map((entry, index) => (
                            <Cell
                                key={entry.category}
                                fill={
                                    activeCategory
                                        ? entry.category === activeCategory
                                            ? COLORS[index % COLORS.length]
                                            : '#e5e7eb'
                                        : COLORS[index % COLORS.length]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Legend
                        formatter={(value: string) => (
                            <span style={{ fontSize: '0.78rem', color: '#475569' }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
