import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusData {
    status: string;
    count: number;
}

interface StatusDonutChartProps {
    data: StatusData[];
    activeStatus?: string;
    onSelect?: (status: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
    completed: '#22c55e',
    cancelled: '#ef4444',
    processing: '#3b82f6',
    pending: '#f59e0b',
};

const DEFAULT_COLOR = '#94a3b8';

const getStatusColor = (status: string) => STATUS_COLORS[status] ?? DEFAULT_COLOR;

export default function StatusDonutChart({ data, activeStatus, onSelect }: StatusDonutChartProps) {
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
                        cursor={onSelect ? 'pointer' : 'default'}
                        isAnimationActive={true}
                        animationDuration={400}
                        onClick={(data: any) => onSelect?.(data.payload?.status ?? data.status)}
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.status}
                                fill={
                                    activeStatus
                                        ? entry.status === activeStatus
                                            ? getStatusColor(entry.status)
                                            : '#e5e7eb'
                                        : getStatusColor(entry.status)
                                }
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
