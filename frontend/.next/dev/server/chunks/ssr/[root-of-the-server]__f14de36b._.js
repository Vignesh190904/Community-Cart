module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/services/api.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "setAuthToken",
    ()=>setAuthToken
]);
const API_BASE = 'http://localhost:5000/api';
let authToken = null;
const setAuthToken = (token)=>{
    authToken = token;
};
const authHeaders = (extra = {})=>{
    const headers = {
        ...extra
    };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    return headers;
};
const api = {
    // Vendors
    vendors: {
        create: async (data)=>{
            const response = await fetch(`${API_BASE}/vendors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create vendor');
            return response.json();
        },
        getAll: async ()=>{
            const response = await fetch(`${API_BASE}/vendors`);
            if (!response.ok) throw new Error('Failed to fetch vendors');
            return response.json();
        },
        getById: async (id)=>{
            const response = await fetch(`${API_BASE}/vendors/${id}`);
            if (!response.ok) throw new Error('Failed to fetch vendor');
            return response.json();
        },
        update: async (id, data)=>{
            const response = await fetch(`${API_BASE}/vendors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update vendor');
            return response.json();
        },
        delete: async (id)=>{
            const response = await fetch(`${API_BASE}/vendors/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete vendor');
            return response.json();
        }
    },
    // Auth
    auth: {
        register: async (data)=>{
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const body = await response.json();
            if (!response.ok) throw new Error(body.message || 'Failed to register');
            return body;
        },
        login: async (data)=>{
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const body = await response.json();
            if (!response.ok) throw new Error(body.message || 'Failed to login');
            return body;
        },
        me: async ()=>{
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: authHeaders()
            });
            const body = await response.json();
            if (!response.ok) throw new Error(body.message || 'Failed to fetch user');
            return body;
        }
    },
    // Customers
    customers: {
        create: async (data)=>{
            const response = await fetch(`${API_BASE}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create customer');
            return response.json();
        },
        getAll: async ()=>{
            const response = await fetch(`${API_BASE}/customers`);
            if (!response.ok) throw new Error('Failed to fetch customers');
            return response.json();
        }
    },
    // Products
    products: {
        create: async (data)=>{
            const response = await fetch(`${API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create product');
            return response.json();
        },
        getAll: async ()=>{
            const response = await fetch(`${API_BASE}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return response.json();
        },
        getById: async (id)=>{
            const response = await fetch(`${API_BASE}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            return response.json();
        },
        update: async (id, data)=>{
            const response = await fetch(`${API_BASE}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update product');
            return response.json();
        },
        delete: async (id)=>{
            const response = await fetch(`${API_BASE}/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            return response.json();
        }
    },
    // Product Sales Analytics
    productSales: {
        getAnalytics: async (vendorId, filters)=>{
            const params = new URLSearchParams();
            params.append('vendorId', vendorId);
            if (filters) {
                Object.entries(filters).forEach(([key, value])=>{
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, String(value));
                    }
                });
            }
            const response = await fetch(`${API_BASE}/product-sales/analytics?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch product sales analytics');
            return response.json();
        },
        getKPIs: async (vendorId, filters)=>{
            const params = new URLSearchParams();
            params.append('vendorId', vendorId);
            if (filters?.startDate) params.append('startDate', filters.startDate);
            if (filters?.endDate) params.append('endDate', filters.endDate);
            const response = await fetch(`${API_BASE}/product-sales/kpis?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch KPIs');
            return response.json();
        },
        getProductDetail: async (productId, vendorId, filters)=>{
            const params = new URLSearchParams();
            params.append('vendorId', vendorId);
            if (filters?.startDate) params.append('startDate', filters.startDate);
            if (filters?.endDate) params.append('endDate', filters.endDate);
            const response = await fetch(`${API_BASE}/product-sales/detail/${productId}?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch product detail');
            return response.json();
        }
    }
};
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales-detail.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "pd-bar": "product-sales-detail-module__RYE_IW__pd-bar",
  "pd-bar-label": "product-sales-detail-module__RYE_IW__pd-bar-label",
  "pd-bar-value": "product-sales-detail-module__RYE_IW__pd-bar-value",
  "pd-breadcrumb": "product-sales-detail-module__RYE_IW__pd-breadcrumb",
  "pd-breadcrumb-link": "product-sales-detail-module__RYE_IW__pd-breadcrumb-link",
  "pd-chart": "product-sales-detail-module__RYE_IW__pd-chart",
  "pd-chart-bar": "product-sales-detail-module__RYE_IW__pd-chart-bar",
  "pd-chart-section": "product-sales-detail-module__RYE_IW__pd-chart-section",
  "pd-chart-title": "product-sales-detail-module__RYE_IW__pd-chart-title",
  "pd-chart-wrapper": "product-sales-detail-module__RYE_IW__pd-chart-wrapper",
  "pd-date-input": "product-sales-detail-module__RYE_IW__pd-date-input",
  "pd-date-selector": "product-sales-detail-module__RYE_IW__pd-date-selector",
  "pd-empty-icon": "product-sales-detail-module__RYE_IW__pd-empty-icon",
  "pd-empty-state": "product-sales-detail-module__RYE_IW__pd-empty-state",
  "pd-empty-title": "product-sales-detail-module__RYE_IW__pd-empty-title",
  "pd-error": "product-sales-detail-module__RYE_IW__pd-error",
  "pd-header": "product-sales-detail-module__RYE_IW__pd-header",
  "pd-header-left": "product-sales-detail-module__RYE_IW__pd-header-left",
  "pd-loading": "product-sales-detail-module__RYE_IW__pd-loading",
  "pd-metric-card": "product-sales-detail-module__RYE_IW__pd-metric-card",
  "pd-metric-label": "product-sales-detail-module__RYE_IW__pd-metric-label",
  "pd-metric-value": "product-sales-detail-module__RYE_IW__pd-metric-value",
  "pd-metrics-grid": "product-sales-detail-module__RYE_IW__pd-metrics-grid",
  "pd-orders-header": "product-sales-detail-module__RYE_IW__pd-orders-header",
  "pd-orders-section": "product-sales-detail-module__RYE_IW__pd-orders-section",
  "pd-orders-title": "product-sales-detail-module__RYE_IW__pd-orders-title",
  "pd-product-meta": "product-sales-detail-module__RYE_IW__pd-product-meta",
  "pd-product-title": "product-sales-detail-module__RYE_IW__pd-product-title",
  "pd-skeleton": "product-sales-detail-module__RYE_IW__pd-skeleton",
  "pd-skeleton-card": "product-sales-detail-module__RYE_IW__pd-skeleton-card",
  "pd-skeleton-chart": "product-sales-detail-module__RYE_IW__pd-skeleton-chart",
  "pd-skeleton-row": "product-sales-detail-module__RYE_IW__pd-skeleton-row",
  "pd-status-badge": "product-sales-detail-module__RYE_IW__pd-status-badge",
  "pd-status-filter": "product-sales-detail-module__RYE_IW__pd-status-filter",
  "pd-table": "product-sales-detail-module__RYE_IW__pd-table",
  "pd-table-wrapper": "product-sales-detail-module__RYE_IW__pd-table-wrapper",
  "product-detail-page": "product-sales-detail-module__RYE_IW__product-detail-page",
  "status-cancelled": "product-sales-detail-module__RYE_IW__status-cancelled",
  "status-confirmed": "product-sales-detail-module__RYE_IW__status-confirmed",
  "status-delivered": "product-sales-detail-module__RYE_IW__status-delivered",
  "status-pending": "product-sales-detail-module__RYE_IW__status-pending",
  "status-shipped": "product-sales-detail-module__RYE_IW__status-shipped",
});
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductSalesDetailPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/services/api.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales-detail.module.css [ssr] (css module)");
;
;
;
;
;
;
function ProductSalesDetailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { productId } = router.query;
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [vendorId, setVendorId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (vendorId && productId) {
            loadDetail();
        }
    }, [
        vendorId,
        productId,
        startDate,
        endDate
    ]);
    const loadDetail = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].productSales.getProductDetail(productId, vendorId, {
                startDate,
                endDate
            });
            setDetail(data);
        } catch (err) {
            setError(err.message || 'Failed to load product details');
            pushToast({
                type: 'error',
                title: 'Load Failed',
                message: err.message
            });
        } finally{
            setLoading(false);
        }
    };
    const goBack = ()=>{
        router.push('/vendor/product-sales');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['product-detail-page'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-header'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-skeleton'],
                        style: {
                            height: '80px',
                            width: '100%'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-grid'],
                    children: [
                        1,
                        2,
                        3,
                        4
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-skeleton'],
                            style: {
                                height: '100px'
                            }
                        }, i, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this);
    }
    if (error || !detail) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['product-detail-page'],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-error-state'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: "Error Loading Product Details"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: error || 'Product not found'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-retry-button'],
                        onClick: loadDetail,
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-back-button'],
                        onClick: goBack,
                        children: "Back to Product Sales"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['product-detail-page'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-header'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-header-left'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-breadcrumb'],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-breadcrumb-link'],
                                        onClick: goBack,
                                        children: "Product Sales"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "›"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: detail.productName
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-product-title'],
                                children: detail.productName
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-product-meta'],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-category-badge'],
                                        children: detail.category || 'Uncategorized'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-meta-separator'],
                                        children: "•"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stock-info'],
                                        children: [
                                            "Stock: ",
                                            detail.currentStock,
                                            " units"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-date-selector'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                children: "From:"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-date-input'],
                                value: startDate,
                                onChange: (e)=>setStartDate(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                children: "To:"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-date-input'],
                                value: endDate,
                                onChange: (e)=>setEndDate(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-grid'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-label'],
                                children: "Total Units Sold"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-value'],
                                children: detail.totalUnitsSold.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-label'],
                                children: "Total Revenue"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-value'],
                                children: [
                                    "₹",
                                    detail.totalRevenue.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-label'],
                                children: "Avg Selling Price"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-value'],
                                children: [
                                    "₹",
                                    detail.avgSellingPrice.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-label'],
                                children: "Orders Count"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-summary-value'],
                                children: detail.ordersCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-trends-section'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-section-title'],
                        children: "Sales Trends"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-container'],
                        children: detail.trendData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-empty-chart'],
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: "No trend data available for the selected period"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-simple-chart'],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-legend'],
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-legend-item'],
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-legend-color'],
                                                    style: {
                                                        background: 'var(--primary)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: "Units Sold"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                            lineNumber: 192,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-legend-item'],
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-legend-color'],
                                                    style: {
                                                        background: 'var(--secondary)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: "Revenue (₹)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-bars'],
                                    children: detail.trendData.map((trend, idx)=>{
                                        const maxUnits = Math.max(...detail.trendData.map((t)=>t.unitsSold), 1);
                                        const maxRevenue = Math.max(...detail.trendData.map((t)=>t.revenue), 1);
                                        const unitsHeight = trend.unitsSold / maxUnits * 100;
                                        const revenueHeight = trend.revenue / maxRevenue * 100;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-bar-group'],
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-bars-container'],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-bar'],
                                                            style: {
                                                                height: `${unitsHeight}%`,
                                                                background: 'var(--primary)'
                                                            },
                                                            title: `Units: ${trend.unitsSold}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-bar'],
                                                            style: {
                                                                height: `${revenueHeight}%`,
                                                                background: 'var(--secondary)'
                                                            },
                                                            title: `Revenue: ₹${trend.revenue.toFixed(2)}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-chart-label'],
                                                    children: new Date(trend.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                            lineNumber: 209,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                            lineNumber: 190,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stats-row'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-label'],
                                children: "Completed Orders"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-value'],
                                children: detail.completedOrdersCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-label'],
                                children: "Cancelled Orders"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-value'],
                                style: {
                                    color: 'var(--error)'
                                },
                                children: detail.cancelledOrdersCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-label'],
                                children: "Cancellation Rate"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-value'],
                                style: {
                                    color: detail.cancellationRate > 10 ? 'var(--error)' : 'var(--text-primary)'
                                },
                                children: [
                                    detail.cancellationRate.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-card'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-label'],
                                children: "Stock vs Sales Ratio"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-value'],
                                children: detail.stockSalesRatio.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-stat-subtext'],
                                children: detail.stockSalesRatio < 1 ? 'Low stock' : detail.stockSalesRatio < 3 ? 'Moderate' : 'High stock'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-orders-section'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-section-title'],
                        children: "Order History"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-table-wrapper'],
                        children: detail.orders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-empty-state'],
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: "No orders found for this product in the selected period"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                            lineNumber: 272,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-table'],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-table-head'],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Order Number"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 279,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Customer"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 280,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Quantity"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 281,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Price"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 282,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 283,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 284,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                lineNumber: 285,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                        lineNumber: 278,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                    lineNumber: 277,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-table-body'],
                                    children: detail.orders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-order-number'],
                                                    children: order.orderNumber
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: order.customerName || '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 292,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: order.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: [
                                                        "₹",
                                                        order.price.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: [
                                                        "₹",
                                                        order.total.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['pd-status-badge']} ${order.status === 'completed' ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['status-completed'] : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$product$2d$sales$2d$detail$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['status-cancelled']}`,
                                                        children: order.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: new Date(order.date).toLocaleDateString()
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, order._id, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                            lineNumber: 290,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/product-sales/[productId].tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f14de36b._.js.map