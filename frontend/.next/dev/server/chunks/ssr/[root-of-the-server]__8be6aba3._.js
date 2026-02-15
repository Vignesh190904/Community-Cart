module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomNavbar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/link.js [ssr] (ecmascript)");
;
;
;
const NAV_ITEMS = [
    {
        href: '/customer/home',
        label: 'Home',
        icon: '/customer/assets/icons/home.svg'
    },
    {
        href: '/customer/browse-products',
        label: 'Search',
        icon: '/customer/assets/icons/search.svg'
    },
    {
        href: '/customer/cart',
        label: 'Cart',
        icon: '/customer/assets/icons/cart.svg'
    },
    {
        href: '/customer/orders',
        label: 'Orders',
        icon: '/customer/assets/icons/order.svg'
    },
    {
        href: '/customer/profile',
        label: 'Profile',
        icon: '/customer/assets/icons/profile.svg'
    }
];
function BottomNavbar() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        className: "customer-bottom-nav",
        children: NAV_ITEMS.map((item)=>{
            // Precise active check: 
            // Home only matches exactly, others match by prefix to handle sub-routes
            const is_active = item.href === '/customer/home' ? router.pathname === item.href : router.pathname.startsWith(item.href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                className: `bottom-nav-item ${is_active ? 'active' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: item.icon,
                    alt: item.label,
                    className: "nav-icon-img"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx",
                    lineNumber: 30,
                    columnNumber: 25
                }, this)
            }, item.href, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx",
                lineNumber: 25,
                columnNumber: 21
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$BottomNavbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [ssr] (ecmascript)");
;
;
;
;
;
function CustomerLayout({ children, disablePadding = false, fullWidth = false }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { is_authenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // 1. THEME LOGIC
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    // 2. THEME TOGGLE EXPORT
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        isDark
    ]);
    // 3. GLOBAL AUTHENTICATION GUARD
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Prevent auto-logout/redirect loop by waiting for AuthContext to finish loading
        if (!loading) {
            if (!is_authenticated) {
                // No valid session found after revalidation
                router.replace('/customer/signin');
            }
        // Onboarding redirect logic removed - users navigate directly to Home after signup
        }
    }, [
        is_authenticated,
        loading,
        router
    ]);
    // 4. LOADING STATE
    // Show a clean loading screen while AuthContext verifies the token/cookie
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDark ? '#121212' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                fontFamily: 'sans-serif'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        fontWeight: '500',
                        fontSize: '16px'
                    },
                    children: "Securely loading session..."
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    // 5. RENDER PROTECTION
    // If not authenticated and finished loading, render nothing while redirecting
    if (!is_authenticated) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `customer-shell ${fullWidth ? 'full-width' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: `customer-main ${disablePadding ? 'no-padding' : ''} page-transition`,
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$BottomNavbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkeletonProductCard",
    ()=>SkeletonProductCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const SkeletonProductCard = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "product-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "product-card-header",
                style: {
                    justifyContent: 'flex-end',
                    padding: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%'
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                    lineNumber: 6,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                lineNumber: 5,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "product-image-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        width: '100%',
                        height: '100%'
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                    lineNumber: 10,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                lineNumber: 9,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "product-card-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "skeleton skeleton-text",
                        style: {
                            width: '80%',
                            height: '1.2em'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                        lineNumber: 14,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "skeleton skeleton-text",
                        style: {
                            width: '40%',
                            height: '1em'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                        lineNumber: 15,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "product-price-wrapper",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "skeleton skeleton-text",
                            style: {
                                width: '30%',
                                height: '1.2em'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                            lineNumber: 17,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                        lineNumber: 16,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "product-card-footer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        width: '100%',
                        height: '36px',
                        borderRadius: '6px'
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                    lineNumber: 22,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx",
        lineNumber: 4,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopNavbar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
// Hardcoded back navigation mapping (demo-grade)
const getBackDestination = (pathname, query)=>{
    const fromParam = query.from;
    switch(pathname){
        case '/customer/profile':
            return '/customer/home';
        case '/customer/browse-products':
            return '/customer/home';
        case '/customer/category':
            // If accessed from browse-products, go back there; otherwise home
            return fromParam === 'browse' ? '/customer/browse-products' : '/customer/home';
        case '/customer/favorites':
            return '/customer/home';
        case '/customer/cart':
            return '/customer/home';
        case '/customer/checkout':
            return '/customer/cart';
        case '/customer/orders':
            return '/customer/home';
        case '/customer/address':
            return '/customer/profile';
        case '/customer/edit-address':
            return '/customer/profile';
        case '/customer/edit-profile':
            return '/customer/profile';
        default:
            // For product detail and other pages, use router.back()
            return null;
    }
};
function TopNavbar({ title, showBack = true, onBack, rightAction = null }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const handleBack = ()=>{
        if (onBack) {
            onBack();
            return;
        }
        const destination = getBackDestination(router.pathname, router.query);
        if (destination) {
            router.push(destination);
        } else {
            router.back();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        className: `top-navbar ${mounted ? 'top-navbar--visible' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "top-navbar__left",
                children: showBack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: "top-navbar__back-btn",
                    onClick: handleBack,
                    "aria-label": "Go back",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                            d: "M15 18l-6-6 6-6"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                            lineNumber: 95,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                    lineNumber: 80,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "top-navbar__title",
                children: title
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "top-navbar__right",
                children: rightAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: "top-navbar__action-btn",
                    onClick: rightAction.onClick,
                    "aria-label": rightAction.label || 'Action',
                    children: rightAction.icon ? rightAction.icon : rightAction.label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "top-navbar__action-label",
                        children: rightAction.label
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                        lineNumber: 113,
                        columnNumber: 15
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                    lineNumber: 105,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/search_bar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "customer-search-bar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: "/customer/assets/icons/search.svg",
                alt: "Search",
                className: "customer-search-icon"
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/search_bar.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "text",
                className: "customer-search-input",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/search_bar.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/search_bar.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$CustomerLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$CustomerStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/CustomerStore.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$customerFetch$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/customerFetch.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$SkeletonProductCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/customer/SkeletonProductCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$TopNavbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/customer/TopNavbar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$search_bar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/customer/search_bar.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const API_BASE = 'http://localhost:5000/api';
function CategoryPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { type } = router.query;
    const { enqueueToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    // Global Cart Store
    const { cart, addToCart, updateQuantity, removeFromCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$CustomerStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"])();
    // State
    const [wishlist, setWishlist] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    // Removed local cart state
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Fetch products from API
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchProducts = async ()=>{
            try {
                setLoading(true);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$customerFetch$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["customerFetch"])(`${API_BASE}/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                // Filter only available products from active vendors
                const availableProducts = data.filter((p)=>p.isAvailable && p.stock > 0 && p.vendor?.isActive !== false);
                setProducts(availableProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                enqueueToast('Failed to load products', 'error');
                setProducts([]);
            } finally{
                setLoading(false);
            }
        };
        fetchProducts();
    }, [
        enqueueToast
    ]);
    // Filter products by category first, then by search query
    const categoryProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!type) return products;
        const categoryType = Array.isArray(type) ? type[0].toLowerCase() : type.toLowerCase();
        return products.filter((p)=>p.category?.trim().toLowerCase() === categoryType);
    }, [
        type,
        products
    ]);
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return categoryProducts.filter((product)=>product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [
        categoryProducts,
        searchQuery
    ]);
    const title = type ? Array.isArray(type) ? type[0] : type : 'Category';
    // Fetch wishlist from API
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchWishlist = async ()=>{
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$customerFetch$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["customerFetch"])(`${API_BASE}/customers/wishlist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Unauthorized: Invalid or expired token');
                        return;
                    }
                    throw new Error('Failed to fetch wishlist');
                }
                const data = await response.json();
                // Extract product IDs from wishlist items
                const wishlistedProductIds = new Set(data.map((item)=>item.product._id));
                setWishlist(wishlistedProductIds);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            // Don't show error toast for wishlist fetch failure - it's not critical
            }
        };
        fetchWishlist();
    }, []);
    // Interactions
    const toggleWishlist = async (id)=>{
        const isCurrentlyWishlisted = wishlist.has(id);
        // Optimistic UI update
        const newWishlist = new Set(wishlist);
        if (isCurrentlyWishlisted) {
            newWishlist.delete(id);
        } else {
            newWishlist.add(id);
        }
        setWishlist(newWishlist);
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                enqueueToast('Please login to manage wishlist', 'error');
                // Revert optimistic update
                setWishlist(wishlist);
                return;
            }
            if (isCurrentlyWishlisted) {
                // Remove from wishlist
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$customerFetch$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["customerFetch"])(`${API_BASE}/customers/wishlist/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to remove from wishlist');
                }
                enqueueToast('Removed from wishlist', 'success');
            } else {
                // Add to wishlist
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$customerFetch$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["customerFetch"])(`${API_BASE}/customers/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: id
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to add to wishlist');
                }
                enqueueToast('Added to wishlist', 'success');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            enqueueToast('Failed to update wishlist', 'error');
            // Revert optimistic update on error
            setWishlist(wishlist);
        }
    };
    // Helper to get logic from global cart
    const getCartQty = (productId)=>{
        const item = cart.find((i)=>i.product._id === productId);
        return item ? item.quantity : 0;
    };
    const handleAddToCart = (product)=>{
        const productLite = {
            _id: product._id,
            name: product.name,
            price: product.price,
            vendorName: product.vendor?.storeName,
            image: product.image,
            stock: product.stock,
            category: product.category
        };
        addToCart(productLite);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$CustomerLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        disablePadding: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$TopNavbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: title,
                showBack: true
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                lineNumber: 215,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "category-page-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: "category-search-section",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$search_bar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            value: searchQuery,
                            onChange: setSearchQuery
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                            lineNumber: 220,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                        lineNumber: 219,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: "category-products-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "category-section-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "category-section-title",
                                        children: "Featured Products"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                        lineNumber: 229,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "category-section-action",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: "/customer/assets/icons/forward.svg",
                                            alt: "View all",
                                            width: 24,
                                            height: 24
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                            lineNumber: 230,
                                            columnNumber: 67
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                        lineNumber: 230,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                lineNumber: 228,
                                columnNumber: 21
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "products-grid",
                                children: Array.from({
                                    length: 8
                                }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$customer$2f$SkeletonProductCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SkeletonProductCard"], {}, `skeleton-${idx}`, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                        lineNumber: 236,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                lineNumber: 234,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "products-grid",
                                        children: filteredProducts.map((product)=>{
                                            const qty = getCartQty(product._id);
                                            const isWishlisted = wishlist.has(product._id);
                                            // Calculate discount if MRP exists and is higher than price
                                            const hasDiscount = product.mrp && product.mrp > product.price;
                                            const discountPercent = hasDiscount ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "product-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "product-card-header",
                                                        children: [
                                                            hasDiscount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "product-badge discount",
                                                                children: [
                                                                    "-",
                                                                    discountPercent,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 257,
                                                                columnNumber: 53
                                                            }, this),
                                                            !hasDiscount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 261,
                                                                columnNumber: 66
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                className: "product-wishlist-btn",
                                                                onClick: ()=>toggleWishlist(product._id),
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                    src: isWishlisted ? "/customer/assets/icons/favorite-filled.svg" : "/customer/assets/icons/favorite.svg",
                                                                    alt: "Wishlist",
                                                                    className: `favorite-heart-icon ${isWishlisted ? 'active' : ''}`,
                                                                    style: {
                                                                        width: '24px',
                                                                        height: '24px'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 262,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "product-image-wrapper",
                                                        onClick: ()=>router.push(`/customer/product-detail?id=${product._id}`),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: product.image || '/customer/assets/icons/missing.svg',
                                                            alt: product.name,
                                                            className: product.image ? 'product-image' : 'product-image-missing'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                            lineNumber: 276,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "product-card-body",
                                                        onClick: ()=>router.push(`/customer/product-detail?id=${product._id}`),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                className: "product-name",
                                                                children: product.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 284,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "product-qty-label",
                                                                children: product.quantity ? `${product.quantity} ${product.unit || ''}` : product.category || 'Product'
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "product-price-wrapper",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "product-final-price",
                                                                        children: [
                                                                            "₹",
                                                                            product.price.toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                        lineNumber: 289,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    hasDiscount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "product-original-price",
                                                                        style: {
                                                                            textDecoration: 'line-through',
                                                                            color: '#999',
                                                                            fontSize: '0.85em',
                                                                            marginLeft: '0.5rem'
                                                                        },
                                                                        children: [
                                                                            "₹",
                                                                            product.mrp.toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                        lineNumber: 291,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                        lineNumber: 283,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "product-card-footer",
                                                        children: qty === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "product-add-btn",
                                                            onClick: ()=>handleAddToCart(product),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                    src: "/customer/assets/icons/bag.svg",
                                                                    alt: "Cart",
                                                                    className: "product-cart-icon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 57
                                                                }, this),
                                                                "Add to cart"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                            lineNumber: 305,
                                                            columnNumber: 53
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "product-qty-controls",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    className: "product-qty-btn",
                                                                    onClick: ()=>{
                                                                        if (qty === 1) {
                                                                            removeFromCart(product._id);
                                                                        } else {
                                                                            updateQuantity(product._id, qty - 1);
                                                                        }
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                        src: "/customer/assets/icons/minus.svg",
                                                                        alt: "Decrease"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                    lineNumber: 314,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "product-qty-value",
                                                                    children: qty
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                    lineNumber: 326,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    className: "product-qty-btn",
                                                                    onClick: ()=>updateQuantity(product._id, qty + 1),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                        src: "/customer/assets/icons/plus.svg",
                                                                        alt: "Increase"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                        lineNumber: 331,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                                    lineNumber: 327,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                        lineNumber: 303,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, product._id, true, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                                lineNumber: 254,
                                                columnNumber: 41
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                        lineNumber: 242,
                                        columnNumber: 29
                                    }, this),
                                    filteredProducts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: '#888'
                                        },
                                        children: "No products found in this category."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                                        lineNumber: 341,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                        lineNumber: 227,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
                lineNumber: 216,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/category.tsx",
        lineNumber: 214,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8be6aba3._.js.map