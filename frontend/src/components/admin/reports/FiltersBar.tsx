import { useState } from 'react';

export interface ReportFilters {
    dateFrom: string;
    dateTo: string;
    vendorId?: string;
    community?: string;
    category?: string;
    status?: string;
}

interface FiltersBarProps {
    filters: ReportFilters;
    onChange: (filters: ReportFilters) => void;
}

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
    // Local state only for date inputs (to avoid fetching on every keypress)
    const [dateFrom, setDateFrom] = useState(filters.dateFrom);
    const [dateTo, setDateTo] = useState(filters.dateTo);

    const applyDates = () => {
        onChange({ ...filters, dateFrom, dateTo });
    };

    const handleReset = () => {
        const reset: ReportFilters = {
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            vendorId: '',
            community: '',
            category: '',
            status: '',
        };
        setDateFrom(filters.dateFrom);
        setDateTo(filters.dateTo);
        onChange(reset);
    };

    return (
        <div className="filters-bar">
            <label>
                From
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    onBlur={applyDates}
                />
            </label>

            <label>
                To
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    onBlur={applyDates}
                />
            </label>

            <label>
                Vendor ID
                <input
                    type="text"
                    placeholder="Optional vendor ID"
                    value={filters.vendorId ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, vendorId: e.target.value })
                    }
                />
            </label>

            <label>
                Community
                <input
                    type="text"
                    placeholder="Optional community"
                    value={filters.community ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, community: e.target.value })
                    }
                />
            </label>

            <div className="filters-bar-actions">
                <button type="button" className="filters-bar-reset" onClick={handleReset}>
                    Reset All
                </button>
            </div>
        </div>
    );
}
