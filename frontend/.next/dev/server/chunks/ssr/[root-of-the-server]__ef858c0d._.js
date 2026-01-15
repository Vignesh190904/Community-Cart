module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
;
const navLinks = [
    {
        href: '/customer/dashboard',
        label: 'Dashboard'
    },
    {
        href: '/customer/browse-products',
        label: 'Browse Products'
    },
    {
        href: '/customer/cart',
        label: 'Cart'
    },
    {
        href: '/customer/cart-pro',
        label: 'Cart-Pro'
    },
    {
        href: '/customer/track-order',
        label: 'Track Orders'
    }
];
function CustomerLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Load theme preference
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    const toggleTheme = ()=>{
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.body.classList.add('theme-dark');
            localStorage.setItem('cc_theme', 'dark');
        } else {
            document.body.classList.remove('theme-dark');
            localStorage.setItem('cc_theme', 'light');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "customer-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "customer-topbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "customer-brand",
                        children: "Customer Test Console"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "customer-nav",
                        children: [
                            navLinks.map((link)=>{
                                const active = router.pathname === link.href;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.href,
                                    className: `customer-nav-link ${active ? 'active' : ''}`,
                                    children: link.label
                                }, link.href, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "customer-theme-toggle",
                                onClick: toggleTheme,
                                title: isDark ? 'Switch to light mode' : 'Switch to dark mode',
                                "aria-label": "Toggle theme",
                                children: isDark ? '☀️' : '🌙'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "customer-main",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrowseProducts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$CustomerLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$CustomerStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/CustomerStore.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
;
;
;
;
;
const API_BASE = 'http://localhost:5000/api';
const CATEGORIES = [
    {
        name: 'Grocery',
        icon: '🧺',
        color: '#EDE7F6',
        iconColor: '#7E57C2'
    },
    {
        name: 'Vegies',
        icon: '🥬',
        color: '#E8F5E9',
        iconColor: '#4CAF50'
    },
    {
        name: 'Fruits',
        icon: '🍎',
        color: '#FFEBEE',
        iconColor: '#EF5350'
    },
    {
        name: 'Bakery',
        icon: '🍔',
        color: '#FCE4EC',
        iconColor: '#EC407A'
    },
    {
        name: 'Laundry',
        icon: '👕',
        color: '#EDE7F6',
        iconColor: '#5E35B1'
    }
];
function BrowseProducts() {
    const { addToCart, updateQuantity, ensureCustomerId, cart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$CustomerStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"])();
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const load = async ()=>{
            await ensureCustomerId();
            try {
                const res = await fetch(`${API_BASE}/products`);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                const available = data.filter((p)=>p.isAvailable !== false && (p.stock ?? 0) > 0);
                setProducts(available);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally{
                setLoading(false);
            }
        };
        load();
    }, [
        ensureCustomerId
    ]);
    const cartMap = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const map = new Map();
        cart.forEach((item)=>map.set(item.product._id, item.quantity));
        return map;
    }, [
        cart
    ]);
    const handleAdd = (product)=>{
        const stock = product.stock ?? 0;
        const currentQty = cartMap.get(product._id) || 0;
        if (stock <= 0) return;
        if (currentQty >= stock) {
            pushToast({
                type: 'warning',
                title: 'Stock limit',
                message: `Only ${stock} left for ${product.name}`
            });
            return;
        }
        // If not in cart, add with qty 1. If in cart, we use the quantity controls instead usually.
        // But for the main button "Add to Cart", we just add 1.
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            vendorName: product.vendor?.name,
            stock: product.stock
        }, stock);
    };
    const updateItemQty = (product, delta)=>{
        const currentQty = cartMap.get(product._id) || 0;
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            // Remove functionality if needed, or just set to 0 (which customer store handles as remove usually? Verify store logic)
            // Store logic: if nextQty <= 0 return null (filter out). So yes, removes.
            updateQuantity(product._id, 0); // Logic says updateQuantity(id, qty).
        } else {
            updateQuantity(product._id, newQty);
        }
    };
    const filteredProducts = products.filter((p)=>p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$CustomerLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "browse-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "search-container",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "search-bar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "search-icon",
                                children: "🔍"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search keywords..",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "categories-list",
                    children: CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "category-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "cat-icon-circle",
                                    style: {
                                        backgroundColor: cat.color
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: cat.iconColor
                                        },
                                        children: cat.icon
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "cat-name",
                                    children: cat.name
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, cat.name, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "section-title",
                    children: [
                        "Featured Products ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: '20px',
                                float: 'right'
                            },
                            children: "❯"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                            lineNumber: 121,
                            columnNumber: 57
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "page-state",
                    children: "Loading products…"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 123,
                    columnNumber: 21
                }, this),
                error && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "page-state error",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 124,
                    columnNumber: 31
                }, this),
                !loading && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "products-grid",
                    children: [
                        filteredProducts.map((product, index)=>{
                            const qtyInCart = cartMap.get(product._id) || 0;
                            const isEven = index % 2 === 0;
                            // Dummy Logic for tags
                            const discount = isEven ? '-16%' : null;
                            const isNew = !isEven;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                className: "product-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "card-top",
                                        children: [
                                            discount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "tag discount",
                                                children: discount
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 139,
                                                columnNumber: 34
                                            }, this),
                                            isNew && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "tag new",
                                                children: "NEW"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 140,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: "wishlist-btn",
                                                children: "♡"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 141,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "product-image-wrap",
                                                children: product.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                    src: product.image,
                                                    alt: product.name,
                                                    className: "product-image"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "image-placeholder"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 143,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                        lineNumber: 138,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "product-name",
                                                children: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 153,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "product-qty-label",
                                                children: "Quantity"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 154,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "product-price",
                                                children: [
                                                    "₹",
                                                    product.price.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                lineNumber: 155,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                        lineNumber: 152,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "card-actions",
                                        children: qtyInCart > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "qty-controls",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "qty-btn",
                                                    onClick: ()=>updateItemQty(product, 1),
                                                    children: "+"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "qty-val",
                                                    children: qtyInCart
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "qty-btn",
                                                    onClick: ()=>updateItemQty(product, -1),
                                                    children: "−"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                            lineNumber: 160,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            className: "add-to-cart-btn",
                                            onClick: ()=>handleAdd(product),
                                            disabled: (product.stock ?? 0) <= 0,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "cart-icon",
                                                    children: "🛍️"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 25
                                                }, this),
                                                " Add to cart"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                            lineNumber: 166,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                        lineNumber: 158,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, product._id, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                                lineNumber: 137,
                                columnNumber: 17
                            }, this);
                        }),
                        filteredProducts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "page-state",
                            children: "No products found."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                            lineNumber: 178,
                            columnNumber: 47
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/browse-products.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef858c0d._.js.map