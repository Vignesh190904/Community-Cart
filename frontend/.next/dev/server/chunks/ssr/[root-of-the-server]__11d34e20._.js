module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyOtp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
'use client';
;
;
;
function VerifyOtp() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const intent = params.get('intent'); // manual_signup | google_signup | signup_phone | google_signup_phone
    const email = params.get('email') || '';
    const mobile = params.get('mobile') || '';
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(Array(6).fill(''));
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        inputRefs.current[0]?.focus();
    }, []);
    const handleChange = (val, idx)=>{
        if (!/^\d?$/.test(val)) return;
        const copy = [
            ...otp
        ];
        copy[idx] = val;
        setOtp(copy);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };
    const handleVerify = async ()=>{
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Enter 6-digit OTP');
            return;
        }
        setLoading(true);
        setError('');
        try {
            /** ===============================
             * EMAIL OTP STEP
             * =============================== */ if (intent === 'manual_signup' || intent === 'google_signup') {
                if (!email) throw new Error('Email missing. Restart signup.');
                const res = await fetch('http://localhost:5000/api/auth/customer/signup/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        otp: otpValue
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Email OTP failed');
                router.push(`/customer/verify-mobile?intent=${intent === 'manual_signup' ? 'signup_phone' : 'google_signup_phone'}&email=${encodeURIComponent(email)}`);
                return;
            }
            /** ===============================
             * MOBILE OTP STEP
             * =============================== */ if (intent === 'signup_phone' || intent === 'google_signup_phone') {
                if (!email || !mobile) throw new Error('Email or mobile missing.');
                const res = await fetch('http://localhost:5000/api/auth/customer/signup/verify-mobile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        mobile,
                        otp: otpValue
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Mobile OTP failed');
                const finalizeEndpoint = intent === 'google_signup_phone' ? '/api/auth/customer/google/signup/finalize' : '/api/auth/customer/signup/finalize';
                const finalRes = await fetch(`http://localhost:5000${finalizeEndpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email
                    })
                });
                const finalData = await finalRes.json();
                if (!finalRes.ok) throw new Error(finalData.message || 'Signup failed');
                localStorage.setItem('auth_token', finalData.token);
                router.push('/customer/home');
                return;
            }
            throw new Error('Invalid signup state. Restart signup.');
        } catch (err) {
            setError(err.message);
            setOtp(Array(6).fill(''));
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "otp-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "Enter OTP"
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
                lineNumber: 123,
                columnNumber: 13
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                style: {
                    color: 'red'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
                lineNumber: 125,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "otp-inputs",
                children: otp.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        maxLength: 1,
                        value: d,
                        onChange: (e)=>handleChange(e.target.value, i),
                        ref: (el)=>{
                            inputRefs.current[i] = el;
                        }
                    }, i, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
                        lineNumber: 129,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleVerify,
                disabled: loading,
                children: loading ? 'Verifying...' : 'Verify'
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
                lineNumber: 139,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/verify-otp.tsx",
        lineNumber: 122,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11d34e20._.js.map