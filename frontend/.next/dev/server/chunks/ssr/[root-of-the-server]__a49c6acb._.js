module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [ssr] (ecmascript)");
'use client';
;
;
;
;
function SignUp() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { is_authenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [name, set_name] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [email, set_email] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, set_password] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [confirm_password, set_confirm_password] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, set_error] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loading, set_loading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const google_initialized = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    // 1. MANUAL SIGNUP START
    const handle_manual_signup = async ()=>{
        if (password !== confirm_password) {
            set_error('Passwords do not match');
            return;
        }
        set_loading(true);
        set_error('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/customer/signup/manual/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            const data = await res.json();
            if (res.status === 409) {
                set_error(data.message);
                return;
            }
            if (!res.ok) throw new Error(data.message);
            sessionStorage.setItem('cc_signup_temp', JSON.stringify({
                name,
                email,
                password
            }));
            router.push({
                pathname: '/customer/verify-otp',
                query: {
                    email,
                    intent: 'manual_signup'
                }
            });
        } catch (err) {
            set_error(err.message);
        } finally{
            set_loading(false);
        }
    };
    // 2. GOOGLE SIGNUP START
    const handle_google_response = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (response)=>{
        set_loading(true);
        set_error('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/customer/signup/google/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: response.credential
                })
            });
            const data = await res.json();
            if (res.status === 409) {
                set_error(data.message);
                return;
            }
            if (!res.ok) throw new Error(data.message);
            sessionStorage.setItem('cc_google_cred', response.credential);
            router.push({
                pathname: '/customer/verify-otp',
                query: {
                    email: data.email,
                    intent: 'google_signup'
                }
            });
        } catch (err) {
            set_error(err.message);
        } finally{
            set_loading(false);
        }
    }, [
        router
    ]);
    // Google Init... (omitted for brevity, same as signin logic)
    // Google Init... (omitted for brevity, same as signin logic)
    const init_google = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (is_authenticated) return;
        const client_id = ("TURBOPACK compile-time value", "593072744898-audf3340cfc8n078bvau1mn8kberm2jj.apps.googleusercontent.com");
        const container = document.getElementById('google-btn-container-signup'); // Double check this ID matches your JSX
        if (!window.google?.accounts?.id || !container || google_initialized.current) return;
        try {
            window.google.accounts.id.initialize({
                client_id: client_id,
                callback: handle_google_response,
                ux_mode: 'popup'
            });
            window.google.accounts.id.renderButton(container, {
                theme: 'outline',
                size: 'large',
                width: 320
            });
            google_initialized.current = true;
        } catch (err) {
            console.error('Google signup init failed:', err);
        }
    }, [
        handle_google_response,
        is_authenticated
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Force a small delay to ensure DOM is ready
        const timer = setTimeout(()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }, 100);
        return ()=>clearTimeout(timer);
    }, [
        init_google
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "signup-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "signup-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "signup-title",
                    children: "Sign Up"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'red',
                        textAlign: 'center'
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 117,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: name,
                        onChange: (e)=>set_name(e.target.value),
                        placeholder: "Name"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 120,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 119,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "email",
                        value: email,
                        onChange: (e)=>set_email(e.target.value),
                        placeholder: "Email"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 123,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 122,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "password",
                        value: password,
                        onChange: (e)=>set_password(e.target.value),
                        placeholder: "Password"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 126,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 125,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "password",
                        value: confirm_password,
                        onChange: (e)=>set_confirm_password(e.target.value),
                        placeholder: "Confirm Password"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 129,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: handle_manual_signup,
                    disabled: loading,
                    className: "signup-button",
                    children: loading ? 'Processing...' : 'Sign Up'
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 132,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    id: "google-btn-container-signup",
                    style: {
                        marginTop: '20px'
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 136,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
            lineNumber: 115,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
        lineNumber: 114,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a49c6acb._.js.map