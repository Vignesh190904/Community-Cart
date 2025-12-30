module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backButton": "[orderId]-module__VRWM_a__backButton",
  "billHeader": "[orderId]-module__VRWM_a__billHeader",
  "billInfoGrid": "[orderId]-module__VRWM_a__billInfoGrid",
  "billInfoItem": "[orderId]-module__VRWM_a__billInfoItem",
  "billInfoLabel": "[orderId]-module__VRWM_a__billInfoLabel",
  "billInfoValue": "[orderId]-module__VRWM_a__billInfoValue",
  "billNoteItem": "[orderId]-module__VRWM_a__billNoteItem",
  "billNotes": "[orderId]-module__VRWM_a__billNotes",
  "billSection": "[orderId]-module__VRWM_a__billSection",
  "billSectionTitle": "[orderId]-module__VRWM_a__billSectionTitle",
  "billSummary": "[orderId]-module__VRWM_a__billSummary",
  "billSummaryLabel": "[orderId]-module__VRWM_a__billSummaryLabel",
  "billSummaryRow": "[orderId]-module__VRWM_a__billSummaryRow",
  "billSummaryValue": "[orderId]-module__VRWM_a__billSummaryValue",
  "billTable": "[orderId]-module__VRWM_a__billTable",
  "billTableWrapper": "[orderId]-module__VRWM_a__billTableWrapper",
  "billTitle": "[orderId]-module__VRWM_a__billTitle",
  "billTitleSection": "[orderId]-module__VRWM_a__billTitleSection",
  "billTotal": "[orderId]-module__VRWM_a__billTotal",
  "cancelled": "[orderId]-module__VRWM_a__cancelled",
  "completed": "[orderId]-module__VRWM_a__completed",
  "errorState": "[orderId]-module__VRWM_a__errorState",
  "fullWidth": "[orderId]-module__VRWM_a__fullWidth",
  "itemNameCell": "[orderId]-module__VRWM_a__itemNameCell",
  "itemNameCol": "[orderId]-module__VRWM_a__itemNameCol",
  "itemPriceCell": "[orderId]-module__VRWM_a__itemPriceCell",
  "itemPriceCol": "[orderId]-module__VRWM_a__itemPriceCol",
  "itemQtyCell": "[orderId]-module__VRWM_a__itemQtyCell",
  "itemQtyCol": "[orderId]-module__VRWM_a__itemQtyCol",
  "itemTotalCell": "[orderId]-module__VRWM_a__itemTotalCell",
  "itemTotalCol": "[orderId]-module__VRWM_a__itemTotalCol",
  "loadingState": "[orderId]-module__VRWM_a__loadingState",
  "orderBillCard": "[orderId]-module__VRWM_a__orderBillCard",
  "orderDetailsContainer": "[orderId]-module__VRWM_a__orderDetailsContainer",
  "orderDetailsHeader": "[orderId]-module__VRWM_a__orderDetailsHeader",
  "orderIdDisplay": "[orderId]-module__VRWM_a__orderIdDisplay",
  "orderStatusBadge": "[orderId]-module__VRWM_a__orderStatusBadge",
  "pending": "[orderId]-module__VRWM_a__pending",
  "processing": "[orderId]-module__VRWM_a__processing",
  "theme-dark": "[orderId]-module__VRWM_a__theme-dark",
});
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorOrderDetails
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].module.css [ssr] (css module)");
;
;
;
;
;
function VendorOrderDetails() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { orderId } = router.query;
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const vendorId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        orderId,
        vendorId
    ]);
    const fetchOrderDetails = async ()=>{
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch order details');
            }
            const data = await res.json();
            // Verify order belongs to this vendor
            if (data.vendorId?._id !== vendorId) {
                pushToast({
                    type: 'error',
                    title: 'Access Denied',
                    message: 'This order does not belong to your store'
                });
                router.push('/vendor/ordershistory');
                return;
            }
            setOrder(data);
        } catch (error) {
            pushToast({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to load order details'
            });
            router.push('/vendor/ordershistory');
        } finally{
            setLoading(false);
        }
    };
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatShortOrderId = (orderNumber)=>{
        // Extract last 6 chars for display
        return orderNumber.slice(-6).toUpperCase();
    };
    const getStatusLabel = (status)=>{
        const labels = {
            pending: 'Pending',
            processing: 'Processing',
            completed: 'Completed',
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    };
    const handleBack = ()=>{
        router.push('/vendor/ordershistory');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderDetailsContainer,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].loadingState,
                children: "Loading order details..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this);
    }
    if (!order) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderDetailsContainer,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorState,
                children: "Order not found"
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderDetailsContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderDetailsHeader,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: handleBack,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].backButton,
                    children: "← Back to Order History"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderBillCard,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billTitleSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billTitle,
                                        children: "Order Details"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderIdDisplay,
                                        children: [
                                            "Order #",
                                            formatShortOrderId(order.orderNumber)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].orderStatusBadge} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"][order.status]}`,
                                children: getStatusLabel(order.status)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSectionTitle,
                                children: "Order Information"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Ordered:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 168,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: formatDate(order.createdAt)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 169,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    order.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Completed:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: formatDate(order.updatedAt)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    order.status === 'cancelled' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Cancelled:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 179,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: formatDate(order.updatedAt)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSectionTitle,
                                children: "Customer Details"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoGrid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Name:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: order.customerId?.name || '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 192,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    order.customerId?.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Phone:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: order.customerId.phone
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    order.delivery?.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fullWidth}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoLabel,
                                                children: "Delivery Address:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billInfoValue,
                                                children: order.delivery.address
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSectionTitle,
                                children: "Order Items"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billTableWrapper,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billTable,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemNameCol,
                                                        children: "Item Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemPriceCol,
                                                        children: "Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemQtyCol,
                                                        children: "Qty"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemTotalCol,
                                                        children: "Total"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 214,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: order.items.map((item, index)=>{
                                                const itemName = item.productId?.name || item.name || 'Unknown Item';
                                                const itemPrice = item.price || 0;
                                                const itemQty = item.quantity || 0;
                                                const itemTotal = item.total || itemPrice * itemQty;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemNameCell,
                                                            children: itemName
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemPriceCell,
                                                            children: [
                                                                "₹",
                                                                itemPrice.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemQtyCell,
                                                            children: itemQty
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].itemTotalCell,
                                                            children: [
                                                                "₹",
                                                                itemTotal.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                            lineNumber: 234,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummary,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryRow,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryLabel,
                                            children: "Subtotal:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryValue,
                                            children: [
                                                "₹",
                                                order.pricing.subtotal.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this),
                                order.pricing.deliveryFee && order.pricing.deliveryFee > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryRow,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryLabel,
                                            children: "Delivery Fee:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryValue,
                                            children: [
                                                "₹",
                                                order.pricing.deliveryFee.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 253,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                order.pricing.tax && order.pricing.tax > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryRow,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryLabel,
                                            children: "Tax:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryValue,
                                            children: [
                                                "₹",
                                                order.pricing.tax.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryRow} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billTotal}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryLabel,
                                            children: "Total:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSummaryValue,
                                            children: [
                                                "₹",
                                                order.pricing.totalAmount.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    (order.delivery?.instructions || order.notes) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billSectionTitle,
                                children: "Notes"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billNotes,
                                children: [
                                    order.delivery?.instructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billNoteItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Delivery Instructions:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 276,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            order.delivery.instructions
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this),
                                    order.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$vendor$2f$ordershistory$2f5b$orderId$5d2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].billNoteItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Order Notes:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                                lineNumber: 281,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            order.notes
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                        lineNumber: 280,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/ordershistory/[orderId].tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__68a64529._.js.map