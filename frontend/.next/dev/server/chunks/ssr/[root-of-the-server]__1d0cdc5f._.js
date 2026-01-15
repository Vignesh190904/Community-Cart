module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "earnings-module__H337RG__active",
  "chip": "earnings-module__H337RG__chip",
  "clearBtn": "earnings-module__H337RG__clearBtn",
  "customRangeRow": "earnings-module__H337RG__customRangeRow",
  "danger": "earnings-module__H337RG__danger",
  "dateInput": "earnings-module__H337RG__dateInput",
  "dateRow": "earnings-module__H337RG__dateRow",
  "error": "earnings-module__H337RG__error",
  "filterControls": "earnings-module__H337RG__filterControls",
  "filterItem": "earnings-module__H337RG__filterItem",
  "filterLabel": "earnings-module__H337RG__filterLabel",
  "filterSection": "earnings-module__H337RG__filterSection",
  "filtersPanel": "earnings-module__H337RG__filtersPanel",
  "filtersRow": "earnings-module__H337RG__filtersRow",
  "inlineControls": "earnings-module__H337RG__inlineControls",
  "metricCard": "earnings-module__H337RG__metricCard",
  "metricLabel": "earnings-module__H337RG__metricLabel",
  "metricValue": "earnings-module__H337RG__metricValue",
  "metricsGrid": "earnings-module__H337RG__metricsGrid",
  "numberInput": "earnings-module__H337RG__numberInput",
  "orLabel": "earnings-module__H337RG__orLabel",
  "pageHeader": "earnings-module__H337RG__pageHeader",
  "pageKicker": "earnings-module__H337RG__pageKicker",
  "pageSubtitle": "earnings-module__H337RG__pageSubtitle",
  "pageTitle": "earnings-module__H337RG__pageTitle",
  "presetRow": "earnings-module__H337RG__presetRow",
  "primary": "earnings-module__H337RG__primary",
  "ps-date": "earnings-module__H337RG__ps-date",
  "ps-input-date": "earnings-module__H337RG__ps-input-date",
  "rangeLabel": "earnings-module__H337RG__rangeLabel",
  "stateBox": "earnings-module__H337RG__stateBox",
  "statusRow": "earnings-module__H337RG__statusRow",
  "toggleButton": "earnings-module__H337RG__toggleButton",
  "unifiedTimeGroup": "earnings-module__H337RG__unifiedTimeGroup",
  "vendorEarningsPage": "earnings-module__H337RG__vendorEarningsPage",
});
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorEarnings
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.module.css [ssr] (css module)");
;
;
;
const API_BASE = 'http://localhost:5000/api';
const formatDate = (d)=>d.toISOString().slice(0, 10);
const getPresetRange = (preset)=>{
    const now = new Date();
    const start = new Date(now);
    if (preset === 'today') {
        return {
            from: formatDate(start),
            to: formatDate(now)
        };
    }
    if (preset === 'week') {
        const day = start.getDay();
        const diff = day === 0 ? 6 : day - 1; // Monday start
        start.setDate(start.getDate() - diff);
        return {
            from: formatDate(start),
            to: formatDate(now)
        };
    }
    if (preset === 'month') {
        start.setDate(1);
        return {
            from: formatDate(start),
            to: formatDate(now)
        };
    }
    if (preset === 'year') {
        start.setMonth(0, 1);
        return {
            from: formatDate(start),
            to: formatDate(now)
        };
    }
    if (preset === 'all') {
        return {
            from: '',
            to: ''
        };
    }
    return {
        from: '',
        to: ''
    };
};
function VendorEarnings() {
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [preset, setPreset] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('month');
    const [fromDate, setFromDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [toDate, setToDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('both');
    const [orderAboveAvg, setOrderAboveAvg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [minUnitsPerOrder, setMinUnitsPerOrder] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [minOrderValue, setMinOrderValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [vendorId, setVendorId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const storedVendorId = undefined;
    }, []);
    const statusQuery = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (status === 'both') return 'completed,cancelled';
        return status;
    }, [
        status
    ]);
    const computedDates = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (preset === 'custom') return {
            from: fromDate,
            to: toDate
        };
        return getPresetRange(preset);
    }, [
        preset,
        fromDate,
        toDate
    ]);
    const fetchMetrics = async ()=>{
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
            const data = await res.json();
            setMetrics(data.metrics);
        } catch (err) {
            setError(err.message || 'Failed to load earnings');
            setMetrics(null);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        preset,
        fromDate,
        toDate,
        statusQuery,
        orderAboveAvg,
        minUnitsPerOrder,
        minOrderValue,
        vendorId
    ]);
    const handlePresetChange = (value)=>{
        setPreset(value);
        if (value !== 'custom') {
            const range = getPresetRange(value);
            setFromDate(range.from);
            setToDate(range.to);
        }
    };
    const handleCustomDateChange = (field, value)=>{
        setPreset('custom');
        if (field === 'from') setFromDate(value);
        if (field === 'to') setToDate(value);
    };
    const handleClear = ()=>{
        setPreset('month');
        const range = getPresetRange('month');
        setFromDate(range.from);
        setToDate(range.to);
        setStatus('both');
        setOrderAboveAvg(false);
        setMinUnitsPerOrder('');
        setMinOrderValue('');
    };
    const valueOrDash = (val)=>typeof val === 'number' && !Number.isNaN(val) ? val.toFixed(2) : '—';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].vendorEarningsPage,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageHeader,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                            children: "Earnings"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSubtitle,
                            children: "Business performance at a glance"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].filtersPanel,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].filtersRow,
                        children: [
                            [
                                {
                                    id: 'today',
                                    label: 'Today'
                                },
                                {
                                    id: 'week',
                                    label: 'This Week'
                                },
                                {
                                    id: 'month',
                                    label: 'This Month'
                                },
                                {
                                    id: 'year',
                                    label: 'This Year'
                                },
                                {
                                    id: 'all',
                                    label: 'All Time'
                                }
                            ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].chip} ${preset === option.id ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].active : ''}`,
                                    onClick: ()=>handlePresetChange(option.id),
                                    children: option.label
                                }, option.id, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].rangeLabel,
                                children: "From:"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: fromDate,
                                onChange: (e)=>handleCustomDateChange('from', e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].rangeLabel,
                                children: "To:"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: toDate,
                                onChange: (e)=>handleCustomDateChange('to', e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].filtersRow,
                        children: [
                            [
                                {
                                    id: 'both',
                                    label: 'Both'
                                },
                                {
                                    id: 'completed',
                                    label: 'Completed'
                                },
                                {
                                    id: 'cancelled',
                                    label: 'Cancelled'
                                }
                            ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].chip} ${status === option.id ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].active : ''}`,
                                    onClick: ()=>setStatus(option.id),
                                    children: option.label
                                }, option.id, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].toggleButton} ${orderAboveAvg ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].active : ''}`,
                                onClick: ()=>setOrderAboveAvg(!orderAboveAvg),
                                role: "button",
                                "aria-pressed": orderAboveAvg,
                                children: "Above Avg"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].numberInput,
                                value: minUnitsPerOrder,
                                onChange: (e)=>setMinUnitsPerOrder(e.target.value),
                                min: "0",
                                placeholder: "Min Units/Order"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].numberInput,
                                value: minOrderValue,
                                onChange: (e)=>setMinOrderValue(e.target.value),
                                min: "0",
                                placeholder: "Min Order Value"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].clearBtn,
                                onClick: handleClear,
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].stateBox,
                children: "Loading earnings…"
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 251,
                columnNumber: 9
            }, this),
            error && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].stateBox} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].error}`,
                children: error
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 255,
                columnNumber: 9
            }, this),
            !loading && !error && !metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].stateBox,
                children: "No data available for the selected filters."
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 259,
                columnNumber: 9
            }, this),
            !loading && !error && metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricsGrid,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Total Earnings"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].primary}`,
                                children: [
                                    "₹",
                                    valueOrDash(metrics.totalEarnings)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Cancelled Order Value"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].danger}`,
                                children: [
                                    "₹",
                                    valueOrDash(metrics.totalCancelledValue)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Completed Orders"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue,
                                children: metrics.completedOrdersCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Cancelled Orders"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue,
                                children: metrics.cancelledOrdersCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Total Units Sold"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue,
                                children: metrics.totalUnitsSold
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Customers Served"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue,
                                children: metrics.customersServed
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricLabel,
                                children: "Average Order Value"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$earnings$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].metricValue,
                                children: [
                                    "₹",
                                    valueOrDash(metrics.averageOrderValue)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
                lineNumber: 263,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/earnings.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d0cdc5f._.js.map