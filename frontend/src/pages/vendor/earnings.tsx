import { useEffect, useMemo, useState } from 'react';
import styles from './earnings.module.css';

interface MetricsResponse {
  filters: {
    from: string | null;
    to: string | null;
    status: string[];
  };
  metrics: {
    totalEarnings: number;
    totalCancelledValue: number;
    completedOrdersCount: number;
    cancelledOrdersCount: number;
    totalUnitsSold: number;
    customersServed: number;
    averageOrderValue: number;
  };
}

type Preset = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';
type StatusFilter = 'both' | 'completed' | 'cancelled';

const API_BASE = 'http://localhost:5000/api';

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

const getPresetRange = (preset: Preset) => {
  const now = new Date();
  const start = new Date(now);

  if (preset === 'today') {
    return { from: formatDate(start), to: formatDate(now) };
  }

  if (preset === 'week') {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday start
    start.setDate(start.getDate() - diff);
    return { from: formatDate(start), to: formatDate(now) };
  }

  if (preset === 'month') {
    start.setDate(1);
    return { from: formatDate(start), to: formatDate(now) };
  }

  if (preset === 'year') {
    start.setMonth(0, 1);
    return { from: formatDate(start), to: formatDate(now) };
  }

  if (preset === 'all') {
    return { from: '', to: '' };
  }

  return { from: '', to: '' };
};

export default function VendorEarnings() {
  const [metrics, setMetrics] = useState<MetricsResponse['metrics'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [preset, setPreset] = useState<Preset>('month');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [status, setStatus] = useState<StatusFilter>('both');
  const [orderAboveAvg, setOrderAboveAvg] = useState(false);
  const [minUnitsPerOrder, setMinUnitsPerOrder] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');

  const [vendorId, setVendorId] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedVendorId =
      localStorage.getItem('cc_vendorId') ||
      localStorage.getItem('vendorId') ||
      '';
    setVendorId(storedVendorId);
  }, []);

  const statusQuery = useMemo(() => {
    if (status === 'both') return 'completed,cancelled';
    return status;
  }, [status]);

  const computedDates = useMemo(() => {
    if (preset === 'custom') return { from: fromDate, to: toDate };
    return getPresetRange(preset);
  }, [preset, fromDate, toDate]);

  const fetchMetrics = async () => {
    if (!vendorId) {
      setError('Vendor not found. Please sign in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.set('status', statusQuery);
      if (computedDates.from) params.set('from', computedDates.from);
      if (computedDates.to) params.set('to', computedDates.to);
      if (orderAboveAvg) params.set('orderAboveAvg', 'true');
      if (minUnitsPerOrder) params.set('minUnitsPerOrder', minUnitsPerOrder);
      if (minOrderValue) params.set('minOrderValue', minOrderValue);

      const res = await fetch(`${API_BASE}/vendors/${vendorId}/earnings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch earnings');
      const data: MetricsResponse = await res.json();
      setMetrics(data.metrics);
    } catch (err: any) {
      setError(err.message || 'Failed to load earnings');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, fromDate, toDate, statusQuery, orderAboveAvg, minUnitsPerOrder, minOrderValue, vendorId]);

  const handlePresetChange = (value: Preset) => {
    setPreset(value);
    if (value !== 'custom') {
      const range = getPresetRange(value);
      setFromDate(range.from);
      setToDate(range.to);
    }
  };

  const handleCustomDateChange = (field: 'from' | 'to', value: string) => {
    setPreset('custom');
    if (field === 'from') setFromDate(value);
    if (field === 'to') setToDate(value);
  };

  const handleClear = () => {
    setPreset('month');
    const range = getPresetRange('month');
    setFromDate(range.from);
    setToDate(range.to);
    setStatus('both');
    setOrderAboveAvg(false);
    setMinUnitsPerOrder('');
    setMinOrderValue('');
  };

  const valueOrDash = (val?: number) =>
    typeof val === 'number' && !Number.isNaN(val) ? val.toFixed(2) : '—';

  return (
    <div className={styles.vendorEarningsPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Earnings</h1>
          <p className={styles.pageSubtitle}>Business performance at a glance</p>
        </div>
      </header>

      <section className={styles.filtersPanel}>
        {/* Row 1: Time presets and custom date range */}
        <div className={styles.filtersRow}>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'all', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.id}
              className={`${styles.chip} ${preset === option.id ? styles.active : ''}`}
              onClick={() => handlePresetChange(option.id as Preset)}
            >
              {option.label}
            </button>
          ))}

          <span className={styles.rangeLabel}>From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleCustomDateChange('from', e.target.value)}
          />
          <span className={styles.rangeLabel}>To:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleCustomDateChange('to', e.target.value)}
          />
        </div>

        {/* Row 2: Status, filters, and clear button */}
        <div className={styles.filtersRow}>
          {[
            { id: 'both', label: 'Both' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((option) => (
            <button
              key={option.id}
              className={`${styles.chip} ${status === option.id ? styles.active : ''}`}
              onClick={() => setStatus(option.id as StatusFilter)}
            >
              {option.label}
            </button>
          ))}

          <button
            className={`${styles.toggleButton} ${orderAboveAvg ? styles.active : ''}`}
            onClick={() => setOrderAboveAvg(!orderAboveAvg)}
            role="button"
            aria-pressed={orderAboveAvg}
          >
            Above Avg
          </button>

          <input
            type="number"
            className={styles.numberInput}
            value={minUnitsPerOrder}
            onChange={(e) => setMinUnitsPerOrder(e.target.value)}
            min="0"
            placeholder="Min Units/Order"
          />

          <input
            type="number"
            className={styles.numberInput}
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            min="0"
            placeholder="Min Order Value"
          />

          <button className={styles.clearBtn} onClick={handleClear}>
            Clear
          </button>
        </div>
      </section>

      {loading && (
        <div className={styles.stateBox}>Loading earnings…</div>
      )}

      {error && !loading && (
        <div className={`${styles.stateBox} ${styles.error}`}>{error}</div>
      )}

      {!loading && !error && !metrics && (
        <div className={styles.stateBox}>No data available for the selected filters.</div>
      )}

      {!loading && !error && metrics && (
        <section className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Earnings</p>
            <p className={`${styles.metricValue} ${styles.primary}`}>₹{valueOrDash(metrics.totalEarnings)}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Cancelled Order Value</p>
            <p className={`${styles.metricValue} ${styles.danger}`}>₹{valueOrDash(metrics.totalCancelledValue)}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Completed Orders</p>
            <p className={styles.metricValue}>{metrics.completedOrdersCount}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Cancelled Orders</p>
            <p className={styles.metricValue}>{metrics.cancelledOrdersCount}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Units Sold</p>
            <p className={styles.metricValue}>{metrics.totalUnitsSold}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Customers Served</p>
            <p className={styles.metricValue}>{metrics.customersServed}</p>
          </article>
          <article className={styles.metricCard}>
            <p className={styles.metricLabel}>Average Order Value</p>
            <p className={styles.metricValue}>₹{valueOrDash(metrics.averageOrderValue)}</p>
          </article>
        </section>
      )}
    </div>
  );
}
