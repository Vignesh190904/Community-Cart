import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { buildApiUrl } from '../../lib/api';
import { fetchWithAuth } from '../../services/api';

import KPIGrid from '../../components/admin/reports/KPIGrid';
import FiltersBar, { ReportFilters } from '../../components/admin/reports/FiltersBar';
import RevenueTrendChart from '../../components/admin/reports/RevenueTrendChart';
import VendorBarChart from '../../components/admin/reports/VendorBarChart';
import CommunityBarChart from '../../components/admin/reports/CommunityBarChart';
import CategoryDonutChart from '../../components/admin/reports/CategoryDonutChart';
import StatusDonutChart from '../../components/admin/reports/StatusDonutChart';
import HeatmapGrid from '../../components/admin/reports/HeatmapGrid';

// ─── Types ────────────────────────────────────────────────────────────
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

interface DashboardData {
    kpis: KPIs;
    revenueTrend: { date: string; revenue: number }[];
    vendorRevenue: { name: string; revenue: number }[];
    communityRevenue: { community: string; revenue: number }[];
    categoryDistribution: { category: string; revenue: number }[];
    orderStatusDistribution: { status: string; count: number }[];
    heatmap: { day: number; hour: number; count: number }[];
}

// ─── Default filter values ────────────────────────────────────────────
const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
const today = dayjs().format('YYYY-MM-DD');

const defaultFilters: ReportFilters = {
    dateFrom: startOfMonth,
    dateTo: today,
    vendorId: '',
    community: '',
};

// ─── Page ─────────────────────────────────────────────────────────────
export default function AdminReports() {
    const [filters, setFilters] = useState<ReportFilters>(defaultFilters);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError('');

                const body: Record<string, string> = {
                    dateFrom: filters.dateFrom,
                    dateTo: filters.dateTo,
                };
                if (filters.vendorId) body.vendorId = filters.vendorId;
                if (filters.community) body.community = filters.community;

                const res = await fetchWithAuth(buildApiUrl('/api/admin/reports/dashboard'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                if (!res.ok) {
                    const msg = await res.json().catch(() => ({ message: 'Request failed' }));
                    throw new Error(msg.message || 'Failed to fetch dashboard');
                }

                const data: DashboardData = await res.json();
                setDashboardData(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [filters]);

    return (
        <div className="reports-dashboard">
            {/* Header */}
            <div className="reports-header">
                <h1>Reports &amp; Analytics</h1>
                <p>Platform-wide sales intelligence and order activity</p>
            </div>

            {/* Filters */}
            <FiltersBar filters={filters} onChange={setFilters} />

            {/* Loading */}
            {loading && (
                <div className="reports-loading">Loading dashboard...</div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="reports-loading" style={{ color: '#ef4444' }}>
                    {error}
                </div>
            )}

            {/* Dashboard */}
            {!loading && !error && dashboardData && (
                <div className="dashboard-container">
                    {/* Row 1 — KPI Grid */}
                    <KPIGrid kpis={dashboardData.kpis} />

                    {/* Row 2 — Revenue Trend (full width) */}
                    <div className="chart-row-full">
                        <RevenueTrendChart data={dashboardData.revenueTrend} />
                    </div>

                    {/* Row 3 — Vendor + Community Bar Charts */}
                    <div className="charts-grid-2">
                        <VendorBarChart data={dashboardData.vendorRevenue} />
                        <CommunityBarChart data={dashboardData.communityRevenue} />
                    </div>

                    {/* Row 4 — Category + Status Donut Charts */}
                    <div className="charts-grid-2">
                        <CategoryDonutChart data={dashboardData.categoryDistribution} />
                        <StatusDonutChart data={dashboardData.orderStatusDistribution} />
                    </div>

                    {/* Row 5 — Heatmap (full width) */}
                    <HeatmapGrid data={dashboardData.heatmap} />
                </div>
            )}
        </div>
    );
}
