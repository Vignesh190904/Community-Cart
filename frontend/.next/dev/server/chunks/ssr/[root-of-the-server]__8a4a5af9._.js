module.exports = [
"[externals]/@hello-pangea/dnd [external] (@hello-pangea/dnd, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@hello-pangea/dnd", () => require("@hello-pangea/dnd"));

module.exports = mod;
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorOrders
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$hello$2d$pangea$2f$dnd__$5b$external$5d$__$2840$hello$2d$pangea$2f$dnd$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@hello-pangea/dnd [external] (@hello-pangea/dnd, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
;
;
;
;
function VendorOrders() {
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    // Get vendorId from localStorage (set during login)
    const vendorId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            pushToast({
                type: 'error',
                title: 'Error',
                message: 'Vendor not logged in'
            });
            setLoading(false);
        }
    }, [
        vendorId
    ]);
    const loadOrders = async ()=>{
        try {
            console.log('[vendor:loadOrders] vendorId=', vendorId);
            const res = await fetch(`http://localhost:5000/api/orders?vendorId=${vendorId}&status=pending,processing,completed,cancelled`);
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            console.log('[vendor:loadOrders] fetched orders count=', data.length);
            setOrders(data);
        } catch (error) {
            pushToast({
                type: 'error',
                title: 'Error',
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
                title: 'Order Updated',
                message: `Order moved to ${newStatus}`
            });
        } catch (error) {
            // Rollback on failure
            setOrders((prev)=>prev.map((o)=>o._id === orderId ? originalOrder : o));
            pushToast({
                type: 'error',
                title: 'Update Failed',
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
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "orders-count",
                                    children: items.length
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                            lineNumber: 173,
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
                                                                lineNumber: 193,
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
                                                                lineNumber: 194,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-customer",
                                                        children: o.customerId?.name || 'Unknown Customer'
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-items",
                                                        children: o.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    idx > 0 && ', ',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        onClick: ()=>window.location.href = `/vendor/product-sales/${item.productId}`,
                                                                        style: {
                                                                            color: 'var(--primary)',
                                                                            cursor: 'pointer',
                                                                            textDecoration: 'underline'
                                                                        },
                                                                        title: "View product sales detail",
                                                                        children: [
                                                                            item.name,
                                                                            " x",
                                                                            item.quantity
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 203,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, item.productId, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-meta",
                                                        children: new Date(o.createdAt).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 21
                                                    }, this),
                                                    o.status === 'completed' || o.status === 'cancelled' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-footer",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `status-badge ${o.status === 'cancelled' ? 'cancelled' : 'done'}`,
                                                            children: o.status === 'cancelled' ? 'Cancelled' : 'Completed'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "order-footer",
                                                        children: [
                                                            type === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "btn-group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small primary",
                                                                        onClick: ()=>advance(o._id, o.status),
                                                                        children: "Accept"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 236,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small danger",
                                                                        onClick: ()=>rejectOrder(o._id),
                                                                        children: "Reject"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 242,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 235,
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
                                                                        lineNumber: 252,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        className: "btn-small danger",
                                                                        onClick: ()=>cancelOrder(o._id),
                                                                        children: "Cancel"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                        lineNumber: 258,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                                lineNumber: 251,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                                lineNumber: 186,
                                                columnNumber: 19
                                            }, this)
                                    }, o._id, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this)),
                                provided.placeholder
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 165,
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
                lineNumber: 282,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 281,
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
                    lineNumber: 292,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Column, {
                    title: "Processing",
                    type: "processing",
                    items: columns.processing
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 293,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Column, {
                    title: "Final Status",
                    type: "completed",
                    items: columns.completed
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
            lineNumber: 291,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/orders.tsx",
        lineNumber: 290,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8a4a5af9._.js.map