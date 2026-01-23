module.exports = [
"[externals]/@hello-pangea/dnd [external] (@hello-pangea/dnd, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@hello-pangea/dnd", () => require("@hello-pangea/dnd"));

module.exports = mod;
}),
"[project]/Desktop/Community-Cart/frontend/src/utils/orderAggregation.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Aggregates order items by product ID or name
 * Groups identical products and sums their quantities
 * 
 * @param items - Raw order items array
 * @returns Aggregated items with combined quantities
 */ __turbopack_context__.s([
    "aggregateOrderItems",
    ()=>aggregateOrderItems,
    "calculateAggregatedTotal",
    ()=>calculateAggregatedTotal
]);
function aggregateOrderItems(items) {
    if (!items || items.length === 0) {
        return [];
    }
    const itemsMap = new Map();
    items.forEach((item)=>{
        // Extract product ID - try multiple sources
        let productId;
        if (typeof item.productId === 'object' && item.productId?._id) {
            productId = item.productId._id;
        } else if (typeof item.productId === 'string') {
            productId = item.productId;
        } else if (typeof item.productId === 'object' && item.productId?.name) {
            productId = item.productId.name;
        } else {
            // Fallback to product name
            productId = item.name || 'unknown';
        }
        const itemName = item.name || 'Unknown Item';
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 0;
        if (itemsMap.has(productId)) {
            // Aggregate with existing item
            const existing = itemsMap.get(productId);
            existing.quantity += itemQuantity;
            if (existing.total !== undefined) {
                existing.total = existing.price * existing.quantity;
            }
        } else {
            // Create new aggregated item
            itemsMap.set(productId, {
                productId,
                name: itemName,
                price: itemPrice,
                quantity: itemQuantity,
                total: item.total || itemPrice * itemQuantity
            });
        }
    });
    return Array.from(itemsMap.values());
}
function calculateAggregatedTotal(items) {
    return items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/utils/vendorAuth.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Vendor Authentication Utilities
 * Provides consistent token management for vendor pages
 */ __turbopack_context__.s([
    "clearVendorAuth",
    ()=>clearVendorAuth,
    "getVendorAuthHeaders",
    ()=>getVendorAuthHeaders,
    "getVendorId",
    ()=>getVendorId,
    "getVendorToken",
    ()=>getVendorToken,
    "getVendorUser",
    ()=>getVendorUser,
    "isVendorAuthenticated",
    ()=>isVendorAuthenticated
]);
const VENDOR_TOKEN_KEY = 'vendor_auth_token';
const VENDOR_USER_KEY = 'vendor_auth_user';
const VENDOR_ID_KEY = 'cc_vendorId';
const getVendorToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
};
const getVendorUser = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const stored = undefined;
};
const getVendorId = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
};
const isVendorAuthenticated = ()=>{
    return !!getVendorToken();
};
const clearVendorAuth = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const getVendorAuthHeaders = ()=>{
    const token = getVendorToken();
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorOrders
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$hello$2d$pangea$2f$dnd__$5b$external$5d$__$2840$hello$2d$pangea$2f$dnd$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@hello-pangea/dnd [external] (@hello-pangea/dnd, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$orderAggregation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/orderAggregation.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$vendorAuth$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/vendorAuth.ts [ssr] (ecmascript)");
;
;
;
;
;
;
;
function VendorOrders() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    // Get vendorId from localStorage (set during login)
    const vendorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$vendorAuth$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getVendorId"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (vendorId) {
            loadOrders();
        } else {
            pushToast({
                type: 'error',
                message: 'Vendor not logged in'
            });
            setLoading(false);
        }
    }, [
        vendorId
    ]);
    const loadOrders = async ()=>{
        try {
            console.log('[vendor:loadOrders] Fetching orders with JWT auth');
            // Get vendor JWT token using utility
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$vendorAuth$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getVendorToken"])();
            if (!token) {
                pushToast({
                    type: 'error',
                    message: 'No authentication token found. Please login again.'
                });
                router.push('/login');
                setLoading(false);
                return;
            }
            const res = await fetch('http://localhost:5000/api/vendors/orders', {
                headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$vendorAuth$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getVendorAuthHeaders"])()
            });
            if (res.status === 401) {
                pushToast({
                    type: 'error',
                    message: 'Session expired. Please login again.'
                });
                router.push('/login');
                setLoading(false);
                return;
            }
            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await res.json();
            console.log('[vendor:loadOrders] fetched orders count=', data.length);
            // Map snapshot-based response to UI format
            const mappedOrders = data.map((orderResponse)=>{
                // Format delivery address from snapshot
                const addressParts = [];
                if (orderResponse.delivery_address_snapshot?.flat_number) {
                    addressParts.push(`Flat ${orderResponse.delivery_address_snapshot.flat_number}`);
                }
                if (orderResponse.delivery_address_snapshot?.floor) {
                    addressParts.push(`Floor ${orderResponse.delivery_address_snapshot.floor}`);
                }
                if (orderResponse.delivery_address_snapshot?.block) {
                    addressParts.push(`Block ${orderResponse.delivery_address_snapshot.block}`);
                }
                if (orderResponse.delivery_address_snapshot?.community) {
                    addressParts.push(orderResponse.delivery_address_snapshot.community);
                }
                const deliveryAddress = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
                return {
                    _id: orderResponse.order_id,
                    orderNumber: orderResponse.order_number,
                    customerName: orderResponse.customer.name || 'Unknown Customer',
                    customerPhone: orderResponse.customer.phone || 'N/A',
                    deliveryAddress,
                    items: orderResponse.items.map((item)=>({
                            productId: item.product_id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.price * item.quantity
                        })),
                    pricing: {
                        totalAmount: orderResponse.total_amount
                    },
                    status: orderResponse.status,
                    createdAt: orderResponse.created_at
                };
            });
            setOrders(mappedOrders);
        } catch (error) {
            pushToast({
                type: 'error',
                message: error.message || 'Failed to load orders'
            });
        } finally{
            setLoading(false);
        }
    };
    const columns = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return {
            pending: orders.filter((o)=>o.status === 'pending'),
            processing: orders.filter((o)=>o.status === 'processing'),
            completed: orders.filter((o)=>{
                if (o.status !== 'completed' && o.status !== 'cancelled') return false;
                const d = new Date(o.createdAt);
                return d >= startOfToday && d < endOfToday;
            })
        };
    }, [
        orders
    ]);
    const canDropTo = (sourceStatus, destStatus)=>{
        if (sourceStatus === 'pending' && destStatus === 'processing') return true;
        if (sourceStatus === 'processing' && destStatus === 'completed') return true;
        return false;
    };
    const updateOrderStatus = async (orderId, newStatus)=>{
        // Store original state for rollback on failure
        const originalOrder = orders.find((o)=>o._id === orderId);
        if (!originalOrder) return;
        // Optimistic update
        setOrders((prev)=>prev.map((o)=>o._id === orderId ? {
                    ...o,
                    status: newStatus
                } : o));
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });
            if (!res.ok) throw new Error('Failed to update order');
            const updated = await res.json();
            console.log('[vendor:updateStatus] orderId=', orderId, 'status=', newStatus);
            pushToast({
                type: 'success',
                message: `Order moved to ${newStatus}`
            });
        } catch (error) {
            // Rollback on failure
            setOrders((prev)=>prev.map((o)=>o._id === orderId ? originalOrder : o));
            pushToast({
                type: 'error',
                message: error.message || 'Could not update order'
            });
        }
    };
    const handleDragEnd = (result)=>{
        const { source, destination, draggableId } = result;
        // Dropped outside valid zone
        if (!destination) {
            return;
        }
        // Dropped in same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }
        const sourceStatus = source.droppableId;
        const destStatus = destination.droppableId;
        // Check if transition is allowed
        if (!canDropTo(sourceStatus, destStatus)) {
            console.warn(`[vendor:drag] Invalid transition from ${sourceStatus} to ${destStatus}`);
            return;
        }
        // Update order status
        updateOrderStatus(draggableId, destStatus);
    };
    const advance = (id, currentStatus)=>{
        if (currentStatus === 'pending') {
            updateOrderStatus(id, 'processing');
        } else if (currentStatus === 'processing') {
            updateOrderStatus(id, 'completed');
        }
    };
    const cancelOrder = (id)=>{
        updateOrderStatus(id, 'cancelled');
    };
    const handleViewOrder = (e, orderId)=>{
        e.preventDefault();
        e.stopPropagation();
        router.push(`/vendor/orderdetails?orderId=${orderId}`);
    };
    const rejectOrder = (id)=>{
        updateOrderStatus(id, 'cancelled');
    };
    const Column = ({ title, type, items })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$hello$2d$pangea$2f$dnd__$5b$external$5d$__$2840$hello$2d$pangea$2f$dnd$2c$__cjs$29$__["Droppable"], {
            droppableId: type,
            children: (provided, snapshot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    className: `orders-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`,
                    ref: provided.innerRef,
                    ...provided.droppableProps,
                    "aria-label": `${title} orders`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                            className: "orders-column-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "orders-column-title",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "orders-count",
                                    children: items.length
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "orders-column-body",
                            children: [
                                items.map((o, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$hello$2d$pangea$2f$dnd__$5b$external$5d$__$2840$hello$2d$pangea$2f$dnd$2c$__cjs$29$__["Draggable"], {
                                        draggableId: o._id,
                                        index: index,
                                        isDragDisabled: type === 'completed',
                                        children: (provided, snapshot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                                className: `order-card ${snapshot.isDragging ? 'dragging' : ''}`,
                                                ref: provided.innerRef,
                                                ...provided.draggableProps,
                                                ...provided.dragHandleProps,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "order-id",
                                                                children: o.orderNumber || o._id
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 292,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "order-total",
                                                                children: [
                                                                    "₹",
                                                                    o.pricing.totalAmount.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-customer",
                                                        children: o.customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-customer",
                                                        style: {
                                                            fontSize: '0.9em',
                                                            color: 'var(--text-secondary)'
                                                        },
                                                        children: [
                                                            "📞 ",
                                                            o.customerPhone
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-customer",
                                                        style: {
                                                            fontSize: '0.85em',
                                                            color: 'var(--text-secondary)',
                                                            marginTop: '4px'
                                                        },
                                                        children: [
                                                            "📍 ",
                                                            o.deliveryAddress
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-items",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$orderAggregation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["aggregateOrderItems"])(o.items).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginBottom: '4px'
                                                                },
                                                                children: [
                                                                    item.name,
                                                                    " x",
                                                                    item.quantity
                                                                ]
                                                            }, item.productId, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-meta",
                                                        children: new Date(o.createdAt).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 21
                                                    }, this),
                                                    o.status === 'completed' || o.status === 'cancelled' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-footer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                className: "btn-view-order",
                                                                onClick: (e)=>handleViewOrder(e, o._id),
                                                                title: "View Order",
                                                                "aria-label": "View order details",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                    width: "18",
                                                                    height: "18",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                            d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                                            cx: "12",
                                                                            cy: "12",
                                                                            r: "3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                            lineNumber: 329,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                    lineNumber: 327,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `status-badge ${o.status === 'cancelled' ? 'cancelled' : 'done'}`,
                                                                children: o.status === 'cancelled' ? 'Cancelled' : 'Completed'
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-footer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                className: "btn-view-order",
                                                                onClick: (e)=>handleViewOrder(e, o._id),
                                                                title: "View Order",
                                                                "aria-label": "View order details",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                    width: "18",
                                                                    height: "18",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                            d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                            lineNumber: 348,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                                            cx: "12",
                                                                            cy: "12",
                                                                            r: "3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                            lineNumber: 349,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 25
                                                            }, this),
                                                            type === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "btn-group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small primary",
                                                                        onClick: ()=>advance(o._id, o.status),
                                                                        children: "Accept"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 354,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small danger",
                                                                        onClick: ()=>rejectOrder(o._id),
                                                                        children: "Reject"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 360,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 353,
                                                                columnNumber: 27
                                                            }, this),
                                                            type === 'processing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "btn-group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small primary",
                                                                        onClick: ()=>advance(o._id, o.status),
                                                                        children: "Done"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 370,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small danger",
                                                                        onClick: ()=>cancelOrder(o._id),
                                                                        children: "Cancel"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 376,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 369,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                lineNumber: 285,
                                                columnNumber: 19
                                            }, this)
                                    }, o._id, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)),
                                provided.placeholder
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 266,
                    columnNumber: 9
                }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 264,
            columnNumber: 5
        }, this);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "orders-board",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                },
                children: "Loading orders..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                lineNumber: 400,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 399,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$hello$2d$pangea$2f$dnd__$5b$external$5d$__$2840$hello$2d$pangea$2f$dnd$2c$__cjs$29$__["DragDropContext"], {
        onDragEnd: handleDragEnd,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "orders-board",
            role: "region",
            "aria-label": "Orders Kanban Board",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Column, {
                    title: "Pending",
                    type: "pending",
                    items: columns.pending
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Column, {
                    title: "Processing",
                    type: "processing",
                    items: columns.processing
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 411,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Column, {
                    title: "Final Status",
                    type: "completed",
                    items: columns.completed
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 412,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 409,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
        lineNumber: 408,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__121d3fb8._.js.map