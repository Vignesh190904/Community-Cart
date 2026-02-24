interface KPIs {
    totalRevenue: number;
    totalOrders: number;
    aov: number;
    avgVendorRevenue: number;
    topVendor: { name: string; revenue: number };
    topCommunity: { name: string; revenue: number };
    topCategory: { name: string; revenue: number };
    successRate: number;
}

interface KPIGridProps {
    kpis: KPIs;
}

const inr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
});

function fmt(value: number) {
    return inr.format(value);
}

export default function KPIGrid({ kpis }: KPIGridProps) {
    const cards = [
        {
            label: 'Total Revenue',
            value: fmt(kpis.totalRevenue),
            sub: 'All completed + pending orders',
        },
        {
            label: 'Total Orders',
            value: kpis.totalOrders.toLocaleString('en-IN'),
            sub: 'In date range',
        },
        {
            label: 'Avg Order Value',
            value: fmt(kpis.aov),
            sub: 'Revenue ÷ orders',
        },
        {
            label: 'Avg Vendor Revenue',
            value: fmt(kpis.avgVendorRevenue),
            sub: 'Per vendor',
        },
        {
            label: 'Top Vendor',
            value: kpis.topVendor.name || '—',
            sub: kpis.topVendor.name ? fmt(kpis.topVendor.revenue) : 'No data',
        },
        {
            label: 'Top Community',
            value: kpis.topCommunity.name || '—',
            sub: kpis.topCommunity.name ? fmt(kpis.topCommunity.revenue) : 'No data',
        },
        {
            label: 'Top Category',
            value: kpis.topCategory.name || '—',
            sub: kpis.topCategory.name ? fmt(kpis.topCategory.revenue) : 'No data',
        },
        {
            label: 'Success Rate',
            value: `${kpis.successRate.toFixed(1)}%`,
            sub: 'Completed + delivered / total',
        },
    ];

    return (
        <div className="kpi-grid">
            {cards.map((card) => (
                <div className="kpi-card" key={card.label}>
                    <span className="kpi-label">{card.label}</span>
                    <span className="kpi-value">{card.value}</span>
                    <span className="kpi-sub">{card.sub}</span>
                </div>
            ))}
        </div>
    );
}
