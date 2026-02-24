import { useState } from 'react';

export interface ReportFilters {
    dateFrom: string;
    dateTo: string;
    vendorId?: string;
    community?: string;
}

interface FiltersBarProps {
    filters: ReportFilters;
    onChange: (filters: ReportFilters) => void;
}

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
    const [local, setLocal] = useState<ReportFilters>({ ...filters });

    const handleApply = () => {
        onChange({ ...local });
    };

    const handleReset = () => {
        const reset: ReportFilters = {
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            vendorId: '',
            community: '',
        };
        setLocal(reset);
        onChange(reset);
    };

    return (
        <div className="filters-bar">
            <label>
                From
                <input
                    type="date"
                    value={local.dateFrom}
                    onChange={(e) => setLocal((prev) => ({ ...prev, dateFrom: e.target.value }))}
                />
            </label>

            <label>
                To
                <input
                    type="date"
                    value={local.dateTo}
                    onChange={(e) => setLocal((prev) => ({ ...prev, dateTo: e.target.value }))}
                />
            </label>

            <label>
                Vendor ID
                <input
                    type="text"
                    placeholder="Optional vendor ID"
                    value={local.vendorId ?? ''}
                    onChange={(e) => setLocal((prev) => ({ ...prev, vendorId: e.target.value }))}
                />
            </label>

            <label>
                Community
                <input
                    type="text"
                    placeholder="Optional community"
                    value={local.community ?? ''}
                    onChange={(e) => setLocal((prev) => ({ ...prev, community: e.target.value }))}
                />
            </label>

            <div className="filters-bar-actions">
                <button type="button" className="filters-bar-apply" onClick={handleApply}>
                    Apply
                </button>
                <button type="button" className="filters-bar-reset" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}
