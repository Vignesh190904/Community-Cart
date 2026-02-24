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
    vendorRevenue: { vendorId: string; name: string; revenue: number }[];
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
    category: '',
    status: '',
};

// ─── Filter chip helper ───────────────────────────────────────────────
interface ChipDef {
    key: keyof ReportFilters;
    label: string;
    value: string;
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function AdminReports() {
    const [filters, setFilters] = useState<ReportFilters>(defaultFilters);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Auto-fetch whenever filters change
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
                if (filters.category) body.category = filters.category;
                if (filters.status) body.status = filters.status;

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

    // ─── Active cross-filter chips ────────────────────────────────────
    const activeChips = ([
        { key: 'vendorId', label: 'Vendor', value: filters.vendorId ?? '' },
        { key: 'community', label: 'Community', value: filters.community ?? '' },
        { key: 'category', label: 'Category', value: filters.category ?? '' },
        { key: 'status', label: 'Status', value: filters.status ?? '' },
    ] as ChipDef[]).filter((c) => c.value !== '');

    const removeChip = (key: keyof ReportFilters) => {
        setFilters((prev) => ({ ...prev, [key]: '' }));
    };

    const setQuickRange = (type: 'week' | 'month' | 'year' | 'all') => {
        let from: string;
        const to = dayjs().format('YYYY-MM-DD');

        if (type === 'week') {
            from = dayjs().startOf('week').format('YYYY-MM-DD');
        } else if (type === 'month') {
            from = dayjs().startOf('month').format('YYYY-MM-DD');
        } else if (type === 'year') {
            from = dayjs().startOf('year').format('YYYY-MM-DD');
        } else {
            from = '2000-01-01';
        }

        setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }));
    };

    const resetFilters = () => {
        setFilters({
            dateFrom: dayjs().startOf('month').format('YYYY-MM-DD'),
            dateTo: dayjs().format('YYYY-MM-DD'),
            vendorId: '',
            community: '',
            category: '',
            status: '',
        });
    };

    return (
        <div className="reports-dashboard">
            {/* Header */}
            <div className="reports-header">
                <h1>Reports &amp; Analytics</h1>
                <p>Platform-wide sales intelligence — click any chart segment to drill down</p>
            </div>
            {/* Quick date range buttons */}
            <div className="quick-date-buttons">
                <button onClick={() => setQuickRange('week')}>This Week</button>
                <button onClick={() => setQuickRange('month')}>This Month</button>
                <button onClick={() => setQuickRange('year')}>This Year</button>
                <button onClick={() => setQuickRange('all')}>All Time</button>
            </div>

            {/* Filters */}
            <FiltersBar filters={filters} onChange={setFilters} />

            {/* Active filter chips */}
            {activeChips.length > 0 && (
                <div className="filter-chips-row">
                    {activeChips.map((chip) => (
                        <span
                            key={chip.key}
                            className="filter-chip"
                            onClick={() => removeChip(chip.key)}
                            title={`Remove ${chip.label} filter`}
                        >
                            {chip.label}: <strong>{chip.value}</strong> &nbsp;❌
                        </span>
                    ))}
                </div>
            )}

            {/* Reset all filters */}
            <div className="reset-filters-wrapper">
                <button className="reset-filters-btn" onClick={resetFilters}>
                    Reset All Filters
                </button>
            </div>

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
                        <VendorBarChart
                            data={dashboardData.vendorRevenue}
                            activeVendorId={filters.vendorId}
                            onSelect={(vendorId) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    vendorId: prev.vendorId === vendorId ? '' : vendorId,
                                }))
                            }
                        />
                        <CommunityBarChart
                            data={dashboardData.communityRevenue}
                            activeCommunity={filters.community}
                            onSelect={(community) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    community: prev.community === community ? '' : community,
                                }))
                            }
                        />
                    </div>

                    {/* Row 4 — Category + Status Donut Charts */}
                    <div className="charts-grid-2">
                        <CategoryDonutChart
                            data={dashboardData.categoryDistribution}
                            activeCategory={filters.category}
                            onSelect={(category) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    category: prev.category === category ? '' : category,
                                }))
                            }
                        />
                        <StatusDonutChart
                            data={dashboardData.orderStatusDistribution}
                            activeStatus={filters.status}
                            onSelect={(status) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: prev.status === status ? '' : status,
                                }))
                            }
                        />
                    </div>

                    {/* Row 5 — Heatmap (full width) */}
                    <HeatmapGrid data={dashboardData.heatmap} />
                </div>
            )}
        </div>
    );
}
