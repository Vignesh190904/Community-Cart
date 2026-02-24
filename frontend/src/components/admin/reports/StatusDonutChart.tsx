import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusData {
    status: string;
    count: number;
}

interface StatusDonutChartProps {
    data: StatusData[];
}

const STATUS_COLORS: Record<string, string> = {
    completed: '#22c55e',
    cancelled: '#ef4444',
    processing: '#3b82f6',
    pending: '#f59e0b',
};

const DEFAULT_COLOR = '#94a3b8';

export default function StatusDonutChart({ data }: StatusDonutChartProps) {
    return (
        <div className="chart-card">
            <h3>Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={STATUS_COLORS[entry.status] ?? DEFAULT_COLOR}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [value.toLocaleString('en-IN'), name]}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Legend
                        formatter={(value: string) => (
                            <span style={{ fontSize: '0.78rem', color: '#475569', textTransform: 'capitalize' }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
