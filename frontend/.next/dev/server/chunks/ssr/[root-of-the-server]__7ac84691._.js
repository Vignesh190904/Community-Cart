module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiCall",
    ()=>apiCall,
    "apiGet",
    ()=>apiGet,
    "apiPost",
    ()=>apiPost
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
async function apiCall(endpoint, options = {}) {
    try {
        // JWT Authentication: Attached from localStorage
        const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        const authHeader = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : {};
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            // credentials: 'include', // REMOVED: Using JWT
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                error: data.message || 'Request failed',
                errorCode: data.error_code
            };
        }
        return {
            data
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Network error',
            errorCode: 'NETWORK_ERROR'
        };
    }
}
async function apiPost(endpoint, body) {
    return apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}
async function apiGet(endpoint) {
    return apiCall(endpoint, {
        method: 'GET'
    });
}
}),
"[project]/Desktop/Community-Cart/frontend/src/flows/signin.flow.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signin",
    ()=>signin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [ssr] (ecmascript)");
;
async function signin(email, password, callbacks) {
    // Validate input
    if (!email || !password) {
        callbacks.onError?.('Email and password are required');
        return;
    }
    // Call backend signin endpoint
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signin', {
        email,
        password
    });
    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_NOT_FOUND') {
            callbacks.onError?.("Account doesn't exist, please sign up");
            return;
        }
        if (result.errorCode === 'INVALID_CREDENTIALS') {
            callbacks.onError?.('Invalid email or password');
            return;
        }
        if (result.errorCode === 'WRONG_AUTH_METHOD') {
            callbacks.onError?.('Please sign in with Google');
            return;
        }
        if (result.errorCode === 'ACCOUNT_INACTIVE') {
            callbacks.onError?.('Your account is inactive. Please contact support.');
            return;
        }
        // Generic error
        callbacks.onError?.(result.error);
        return;
    }
    // Success! Token and user are now returned
    callbacks.onSuccess?.(result.data?.user, result.data?.auth_token);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/flows/google-signin.flow.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "googleSignin",
    ()=>googleSignin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [ssr] (ecmascript)");
;
async function googleSignin(googleToken, callbacks) {
    // Validate input
    if (!googleToken) {
        callbacks.onError?.('Google authentication failed. Please try again.');
        return;
    }
    // Call backend Google signin endpoint
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signin', {
        googleToken
    });
    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_NOT_FOUND') {
            callbacks.onError?.("Account doesn't exist, please sign up");
            return;
        }
        if (result.errorCode === 'WRONG_AUTH_METHOD') {
            callbacks.onError?.('Please sign in with email and password');
            return;
        }
        if (result.errorCode === 'GOOGLE_AUTH_FAILED') {
            callbacks.onError?.('Google authentication failed. Please try again.');
            return;
        }
        if (result.errorCode === 'ACCOUNT_INACTIVE') {
            callbacks.onError?.('Your account is inactive. Please contact support.');
            return;
        }
        // Generic error
        callbacks.onError?.(result.error);
        return;
    }
    // Success! Token and user are now returned
    callbacks.onSuccess?.(result.data?.user, result.data?.auth_token);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignIn
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signin$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/signin.flow.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signin$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/google-signin.flow.ts [ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function SignIn() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { sign_in, is_authenticated, loading: auth_loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const googleInitialized = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const handleManualSignin = ()=>{
        setLoading(true);
        setError('');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signin$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["signin"])(email, password, {
            onSuccess: (user, token)=>{
                sign_in(user, token);
                router.push('/customer/home');
            },
            onError: (message)=>{
                setError(message);
                setLoading(false);
            }
        });
    };
    const handleGoogleResponse = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((response)=>{
        setLoading(true);
        setError('');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signin$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["googleSignin"])(response.credential, {
            onSuccess: (user, token)=>{
                sign_in(user, token);
                router.push('/customer/home');
            },
            onError: (message)=>{
                setError(message);
                setLoading(false);
            }
        });
    }, [
        router,
        sign_in
    ]);
    const initGoogle = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        const clientId = ("TURBOPACK compile-time value", "593072744898-audf3340cfc8n078bvau1mn8kberm2jj.apps.googleusercontent.com");
        const container = document.getElementById('google-btn-container');
        if (!window.google?.accounts?.id || !container || googleInitialized.current) return;
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            ux_mode: 'popup'
        });
        window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 320
        });
        googleInitialized.current = true;
    }, [
        handleGoogleResponse
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const listener = ()=>initGoogle();
        window.addEventListener('google-gis-loaded', listener);
        return ()=>window.removeEventListener('google-gis-loaded', listener);
    }, [
        initGoogle
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "signin-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "signin-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "signin-title",
                    children: "Sign In"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 95,
                    columnNumber: 17
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'red'
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 97,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "input-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "input-label",
                            children: "Email Address"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 100,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "input-field",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                className: "input-text",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                placeholder: "Email"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 101,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 99,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "input-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "input-label",
                            children: "Password"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "input-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: showPassword ? 'text' : 'password',
                                    className: "input-text",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    placeholder: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: `/customer/assets/icons/${showPassword ? 'view.svg' : 'hide.svg'}`,
                                    alt: "toggle password",
                                    className: "input-icon-right password-toggle",
                                    onClick: ()=>setShowPassword(!showPassword)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                                    lineNumber: 122,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 114,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 112,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "forgot-password-row",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "forgot-password-link",
                        children: "Forgot Password?"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                        lineNumber: 132,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 131,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: "signin-button",
                    onClick: handleManualSignin,
                    disabled: loading,
                    children: loading ? 'Signing In...' : 'Sign In'
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 137,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "signup-text",
                            children: "Don't have an account? "
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 146,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "signup-link",
                            onClick: ()=>router.push('/customer/signup'),
                            children: "Sign Up"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 147,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 145,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'relative',
                        width: '100%'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "google-button",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: "/customer/assets/icons/google.svg",
                                    alt: "google",
                                    className: "google-icon"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                                    lineNumber: 159,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "google-button-text",
                                    children: "Continue with Google"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                                    lineNumber: 164,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 158,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            id: "google-btn-container",
                            style: {
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                zIndex: 10
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                            lineNumber: 170,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
                    lineNumber: 156,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
            lineNumber: 94,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signin.tsx",
        lineNumber: 93,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7ac84691._.js.map