module.exports = [
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingLayout.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
;
;
function OnboardingLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-2b53693c87435f33" + " " + "onboarding-layout",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-2b53693c87435f33" + " " + "onboarding-content",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingLayout.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "2b53693c87435f33",
                children: ".onboarding-layout.jsx-2b53693c87435f33{background:var(--bg-primary);flex-direction:column;width:100%;min-height:100vh;display:flex}.onboarding-content.jsx-2b53693c87435f33{flex:1;width:100%;max-width:100%;margin:0 auto}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingLayout.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingAddress
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
;
;
;
;
;
function OnboardingAddress() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { onboardingStep, getRouteForStep, setOnboardingStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Form State - Only 4 fields as specified
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        flatNo: '',
        floorNo: '',
        blockName: '',
        community: 'Community Cart'
    });
    // ROUTE GUARD: Enforce onboarding step requirements
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const allowedSteps = [
            'PHONE_VERIFIED',
            'ADDRESS_PENDING'
        ];
        if (onboardingStep && !allowedSteps.includes(onboardingStep)) {
            // User is at wrong step - redirect to correct route
            const correctRoute = getRouteForStep(onboardingStep);
            router.replace(correctRoute);
        } else if (!onboardingStep) {
            // No onboarding step set - shouldn't be here
            router.replace('/customer/signin');
        } else if (onboardingStep === 'PHONE_VERIFIED') {
            // Set to ADDRESS_PENDING when entering address page
            setOnboardingStep('ADDRESS_PENDING');
        }
    }, [
        onboardingStep,
        router,
        getRouteForStep,
        setOnboardingStep
    ]);
    const handleChange = (field, value)=>{
        setForm((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const handleSubmit = async ()=>{
        // Validate required fields (Floor No is optional)
        if (!form.flatNo || !form.blockName || !form.community) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        setLoading(true);
        try {
            // FIX: Now that the user is authenticated from verify-otp, 
            // we call the backend directly to persist the address.
            const payload = {
                line1: `Flat ${form.flatNo}, Floor ${form.floorNo}, ${form.blockName}`,
                line2: form.community,
                area: form.community,
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500000',
                is_primary: true
            };
            const res = await fetch('http://localhost:5000/api/customers/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include' // Sends JWT cookie
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save address');
            }
            showToast('Address saved successfully', 'success');
            // FIX: Clear onboarding step to signify completion
            setOnboardingStep(null);
            // FIX: Redirect directly to home instead of signin/logout
            router.push('/customer/home');
        } catch (error) {
            showToast(error.message || 'Error saving address', 'error');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "onboarding-address-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "onboarding-address-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "onboarding-address-title",
                    children: "Add Delivery Address"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                    lineNumber: 94,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                lineNumber: 93,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    height: '32px'
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "onboarding-address-form",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "onboarding-address-input-group",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "onboarding-address-input-wrapper",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "onboarding-address-label",
                                    children: "Community / Apartment Name"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 105,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "onboarding-address-input",
                                    value: form.community,
                                    readOnly: true,
                                    style: {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 106,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                            lineNumber: 104,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                        lineNumber: 103,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "onboarding-address-input-group",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "onboarding-address-input-wrapper",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "onboarding-address-label",
                                    children: "Block / Building Name *"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 119,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "onboarding-address-input",
                                    value: form.blockName,
                                    onChange: (e)=>handleChange('blockName', e.target.value),
                                    placeholder: "e.g. Block A"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 120,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                            lineNumber: 118,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                        lineNumber: 117,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "onboarding-address-input-group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "onboarding-address-input-wrapper",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "onboarding-address-label",
                                            children: "Floor No"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                            lineNumber: 134,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "onboarding-address-input",
                                            value: form.floorNo,
                                            onChange: (e)=>handleChange('floorNo', e.target.value),
                                            placeholder: "e.g. 5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                            lineNumber: 135,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 133,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                lineNumber: 132,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "onboarding-address-input-group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "onboarding-address-input-wrapper",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "onboarding-address-label",
                                            children: "Flat / House No *"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                            lineNumber: 147,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: "onboarding-address-input",
                                            value: form.flatNo,
                                            onChange: (e)=>handleChange('flatNo', e.target.value),
                                            placeholder: "e.g. 504"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                            lineNumber: 148,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                    lineNumber: 146,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                        lineNumber: 131,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                lineNumber: 100,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "onboarding-address-cta-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: "onboarding-address-cta-btn",
                    onClick: handleSubmit,
                    disabled: loading,
                    children: loading ? 'Saving...' : 'Save Address'
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                    lineNumber: 163,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
                lineNumber: 162,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx",
        lineNumber: 91,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/onboarding/address.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingAddressPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$onboarding$2f$OnboardingLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingLayout.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$onboarding$2f$OnboardingAddress$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/onboarding/OnboardingAddress.tsx [ssr] (ecmascript)");
;
;
;
function OnboardingAddressPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$onboarding$2f$OnboardingLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$onboarding$2f$OnboardingAddress$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/onboarding/address.tsx",
            lineNumber: 7,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/onboarding/address.tsx",
        lineNumber: 6,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__61f96fe3._.js.map