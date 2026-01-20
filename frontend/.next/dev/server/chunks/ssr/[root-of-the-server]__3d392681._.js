module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyMobile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [ssr] (ecmascript)");
;
;
;
;
function VerifyMobile() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const intent = router.query.intent; // 'signup' | 'google_signup_phone' | undefined
    const { onboarding_step, get_route_for_step, loading, is_authenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // Defaulting to empty string for precision, sanitized to snake_case
    const [mobile_number, set_mobile_number] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [is_loading, set_is_loading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // ROUTE GUARD: Enforce onboarding step requirements and session persistence
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!loading) {
            // If the user loses their session during this step, send them to signin
            if (!is_authenticated && (intent === 'signup' || intent === 'google_signup_phone')) {
                router.replace('/customer/signin');
                return;
            }
            // Only enforce onboarding guard for specific flows
            if (intent === 'signup' || intent === 'google_signup_phone') {
                const allowed_steps = [
                    'EMAIL_VERIFIED',
                    'PHONE_PENDING'
                ];
                if (onboarding_step && !allowed_steps.includes(onboarding_step)) {
                    // User is at wrong step - redirect to correct route
                    const correct_route = get_route_for_step(onboarding_step);
                    if (router.pathname !== correct_route) {
                        router.replace(correct_route);
                    }
                }
            }
        }
    }, [
        onboarding_step,
        intent,
        router,
        get_route_for_step,
        loading,
        is_authenticated
    ]);
    const handle_verify = async ()=>{
        if (mobile_number.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }
        set_is_loading(true);
        try {
            // Get email from query params or appropriate session storage
            let email = router.query.email;
            if (!email) {
                const isGoogle = intent?.includes('google');
                const key = isGoogle ? 'cc_google_signup_temp' : 'cc_signup_temp';
                const stored = JSON.parse(sessionStorage.getItem(key) || '{}');
                email = stored.email;
                // Fallback for Google flow
                if (!email && isGoogle) {
                    const storedManual = JSON.parse(sessionStorage.getItem('cc_signup_temp') || '{}');
                    email = storedManual.email;
                }
            }
            if (!email) {
                throw new Error('Email not found. Please start signup again.');
            }
            // Call the add-mobile endpoint which sends OTP
            const res = await fetch('http://localhost:5000/api/auth/customer/signup/add-mobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    mobile: mobile_number
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }
            // Navigate to OTP verification page
            router.push({
                pathname: '/customer/verify-otp',
                query: {
                    mobile: mobile_number,
                    email,
                    intent: intent === 'signup_phone' ? 'signup_phone' : 'google_signup_phone'
                }
            });
        } catch (err) {
            console.error('Send Mobile OTP Error:', err);
            alert(err.message);
        } finally{
            set_is_loading(false);
        }
    };
    // Prevent rendering while the AuthContext is still verifying the session
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: "Checking session..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                lineNumber: 99,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
            lineNumber: 98,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "verify-mobile-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "vm-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "vm-back-button",
                        onClick: ()=>router.back(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            className: "vm-back-icon",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2.5,
                                d: "M15 19l-7-7 7-7"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                lineNumber: 115,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                            lineNumber: 108,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                        lineNumber: 107,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "vm-title",
                        children: "Verify Mobile"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                        lineNumber: 123,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                lineNumber: 106,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "vm-subtitle",
                children: "Please enter your mobile number. You'll receive a One-Time-Password."
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                lineNumber: 126,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "vm-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "vm-input-group",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "vm-input-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "vm-input-label",
                                    children: "Phone no."
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                    lineNumber: 133,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "vm-prefix-container",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "vm-prefix",
                                            children: "+91"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                            lineNumber: 136,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "vm-divider"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                            lineNumber: 137,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                    lineNumber: 135,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "tel",
                                    className: "vm-phone-input",
                                    value: mobile_number,
                                    onChange: (e)=>set_mobile_number(e.target.value.replace(/\D/g, '')),
                                    maxLength: 10,
                                    placeholder: "Enter 10 digit number"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                    lineNumber: 140,
                                    columnNumber: 25
                                }, this),
                                mobile_number.length === 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: "/customer/assets/icons/check.svg",
                                    alt: "verified",
                                    className: "vm-input-icon-right"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                                    lineNumber: 150,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                            lineNumber: 132,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                        lineNumber: 131,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "vm-verify-button",
                        onClick: handle_verify,
                        disabled: is_loading,
                        children: is_loading ? 'Sending...' : 'Send / Verify'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
                lineNumber: 130,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-mobile.tsx",
        lineNumber: 105,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3d392681._.js.map