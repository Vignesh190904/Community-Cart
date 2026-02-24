import { ReactNode } from 'react';
import AnimatedNumber from './AnimatedNumber';

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

const fmtCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(val);

interface CardDef {
    label: string;
    value: ReactNode;
    sub: ReactNode;
}

export default function KPIGrid({ kpis }: KPIGridProps) {
    const cards: CardDef[] = [
        {
            label: 'Total Revenue',
            value: <AnimatedNumber value={kpis.totalRevenue} formatter={fmtCurrency} />,
            sub: 'All completed + pending orders',
        },
        {
            label: 'Total Orders',
            value: <AnimatedNumber value={kpis.totalOrders} formatter={(v) => Math.round(v).toLocaleString('en-IN')} />,
            sub: 'In date range',
        },
        {
            label: 'Avg Order Value',
            value: <AnimatedNumber value={kpis.aov} formatter={fmtCurrency} />,
            sub: 'Revenue ÷ orders',
        },
        {
            label: 'Avg Vendor Revenue',
            value: <AnimatedNumber value={kpis.avgVendorRevenue} formatter={fmtCurrency} />,
            sub: 'Per vendor',
        },
        {
            label: 'Top Vendor',
            value: kpis.topVendor.name || '—',
            sub: kpis.topVendor.name ? <AnimatedNumber value={kpis.topVendor.revenue} formatter={fmtCurrency} /> : 'No data',
        },
        {
            label: 'Top Community',
            value: kpis.topCommunity.name || '—',
            sub: kpis.topCommunity.name ? <AnimatedNumber value={kpis.topCommunity.revenue} formatter={fmtCurrency} /> : 'No data',
        },
        {
            label: 'Top Category',
            value: kpis.topCategory.name || '—',
            sub: kpis.topCategory.name ? <AnimatedNumber value={kpis.topCategory.revenue} formatter={fmtCurrency} /> : 'No data',
        },
        {
            label: 'Success Rate',
            value: <AnimatedNumber value={kpis.successRate} formatter={(v) => `${v.toFixed(1)}%`} />,
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

