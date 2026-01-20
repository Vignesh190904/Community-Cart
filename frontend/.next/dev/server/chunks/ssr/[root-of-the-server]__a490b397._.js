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
"[project]/Desktop/Community-Cart/frontend/src/flows/signup.flow.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSignupData",
    ()=>clearSignupData,
    "getSignupData",
    ()=>getSignupData,
    "resendEmailOtp",
    ()=>resendEmailOtp,
    "startSignup",
    ()=>startSignup,
    "verifyEmailOtp",
    ()=>verifyEmailOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [ssr] (ecmascript)");
;
// Session storage keys
const STORAGE_KEY_SIGNUP = 'cc_signup_temp';
async function startSignup(data, callbacks) {
    const { name, email, password } = data;
    // Validate input
    if (!name || !email || !password) {
        callbacks.onError?.('All fields are required');
        return;
    }
    // Call backend
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/start', {
        name,
        email,
        password
    });
    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'EMAIL_EXISTS') {
            callbacks.onError?.('Email already registered. Please sign in.');
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }
    // Store signup data temporarily
    sessionStorage.setItem(STORAGE_KEY_SIGNUP, JSON.stringify({
        name,
        email,
        password
    }));
    // Navigate to email OTP verification
    callbacks.onNavigate?.('/customer/verify-otp', {
        email,
        intent: 'manual_signup'
    });
}
async function verifyEmailOtp(email, otp, callbacks) {
    if (!email || !otp) {
        callbacks.onError?.('Email and OTP are required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/verify-email', {
        email,
        otp
    });
    if (result.error) {
        if (result.errorCode === 'INVALID_OTP') {
            callbacks.onError?.('Invalid or expired OTP. Please try again.');
            return;
        }
        if (result.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            // Clear storage
            sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }
    // Clear temporary storage
    sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
    // Store auth token
    if (result.data?.auth_token) {
        localStorage.setItem('auth_token', result.data.auth_token);
    }
    if (result.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(result.data.user));
    }
    // Success! Navigate to home
    callbacks.onNavigate?.('/customer/home');
}
async function resendEmailOtp(email, callbacks) {
    if (!email) {
        callbacks.onError?.('Email is required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/resend-otp', {
        email
    });
    if (result.error) {
        callbacks.onError?.(result.error);
        return;
    }
    callbacks.onSuccess?.();
}
function getSignupData() {
    const data = sessionStorage.getItem(STORAGE_KEY_SIGNUP);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch  {
        return null;
    }
}
function clearSignupData() {
    sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/flows/google-signup.flow.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearGoogleSignupData",
    ()=>clearGoogleSignupData,
    "getGoogleSignupData",
    ()=>getGoogleSignupData,
    "getGoogleToken",
    ()=>getGoogleToken,
    "resendGoogleEmailOtp",
    ()=>resendGoogleEmailOtp,
    "startGoogleSignup",
    ()=>startGoogleSignup,
    "verifyGoogleEmailOtp",
    ()=>verifyGoogleEmailOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [ssr] (ecmascript)");
;
// Session storage keys
const STORAGE_KEY_GOOGLE_TOKEN = 'cc_google_token';
const STORAGE_KEY_GOOGLE_SIGNUP = 'cc_google_signup_temp';
async function startGoogleSignup(googleToken, callbacks) {
    if (!googleToken) {
        callbacks.onError?.('Google authentication failed. Please try again.');
        return;
    }
    // Call backend
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/start', {
        googleToken
    });
    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_ALREADY_EXISTS') {
            callbacks.onError?.('Account already exists. Please sign in.');
            return;
        }
        if (result.errorCode === 'GOOGLE_AUTH_FAILED') {
            callbacks.onError?.('Google authentication failed. Please try again.');
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }
    // Store Google token temporarily
    sessionStorage.setItem(STORAGE_KEY_GOOGLE_TOKEN, googleToken);
    // Store email if returned by backend
    if (result.data?.data?.email) {
        sessionStorage.setItem(STORAGE_KEY_GOOGLE_SIGNUP, JSON.stringify({
            email: result.data.data.email
        }));
    }
    // Navigate to email OTP verification
    const email = result.data?.data?.email || '';
    callbacks.onNavigate?.('/customer/verify-otp', {
        email,
        intent: 'google_signup'
    });
}
async function verifyGoogleEmailOtp(email, otp, callbacks) {
    if (!email || !otp) {
        callbacks.onError?.('Email and OTP are required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/verify-email', {
        email,
        otp
    });
    if (result.error) {
        if (result.errorCode === 'INVALID_OTP') {
            callbacks.onError?.('Invalid or expired OTP. Please try again.');
            return;
        }
        if (result.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            clearGoogleSignupData();
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }
    // Clear temporary storage
    clearGoogleSignupData();
    // Store auth token
    if (result.data?.auth_token) {
        localStorage.setItem('auth_token', result.data.auth_token);
    }
    if (result.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(result.data.user));
    }
    // Success! Navigate to home
    callbacks.onNavigate?.('/customer/home');
}
async function resendGoogleEmailOtp(email, callbacks) {
    if (!email) {
        callbacks.onError?.('Email is required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/resend-otp', {
        email
    });
    if (result.error) {
        callbacks.onError?.(result.error);
        return;
    }
    callbacks.onSuccess?.();
}
function getGoogleSignupData() {
    const data = sessionStorage.getItem(STORAGE_KEY_GOOGLE_SIGNUP);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch  {
        return null;
    }
}
function getGoogleToken() {
    return sessionStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);
}
function clearGoogleSignupData() {
    sessionStorage.removeItem(STORAGE_KEY_GOOGLE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_GOOGLE_SIGNUP);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signup$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/signup.flow.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signup$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/google-signup.flow.ts [ssr] (ecmascript)");
'use client';
;
;
;
;
;
function SignUp() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const googleInitialized = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    /* ===============================
       MANUAL SIGNUP
       =============================== */ const handleManualSignup = ()=>{
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signup$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["startSignup"])({
            name,
            email,
            password
        }, {
            // DO NOT navigate to home here
            onNavigate: (path, query)=>{
                router.push({
                    pathname: path,
                    query
                });
                setLoading(false);
            },
            onError: (message)=>{
                setError(message);
                setLoading(false);
            }
        });
    };
    /* ===============================
       GOOGLE SIGNUP
       =============================== */ const handleGoogleResponse = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((response)=>{
        setLoading(true);
        setError('');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signup$2e$flow$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["startGoogleSignup"])(response.credential, {
            // DO NOT navigate to home here
            onNavigate: (path, query)=>{
                router.push({
                    pathname: path,
                    query
                });
                setLoading(false);
            },
            onError: (message)=>{
                setError(message);
                setLoading(false);
            }
        });
    }, [
        router
    ]);
    /* ===============================
       GOOGLE INIT
       =============================== */ const initGoogle = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        const container = document.getElementById('google-btn-container-signup');
        const clientId = ("TURBOPACK compile-time value", "593072744898-audf3340cfc8n078bvau1mn8kberm2jj.apps.googleusercontent.com");
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
        const timer = setTimeout(()=>{
            initGoogle();
        }, 100);
        return ()=>clearTimeout(timer);
    }, [
        initGoogle
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
                    lineNumber: 118,
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
                    lineNumber: 121,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-group",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "signup-input-field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "signup-input-label",
                                children: "Name"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 126,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                className: "signup-input-text",
                                placeholder: "Name",
                                value: name,
                                onChange: (e)=>setName(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 127,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 125,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 124,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-group",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "signup-input-field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "signup-input-label",
                                children: "Email"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 139,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                className: "signup-input-text",
                                placeholder: "Email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 140,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 138,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 137,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-group",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "signup-input-field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "signup-input-label",
                                children: "Password"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 152,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: showPassword ? 'text' : 'password',
                                className: "signup-input-text",
                                placeholder: "Password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 153,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: `/customer/assets/icons/${showPassword ? 'view.svg' : 'hide.svg'}`,
                                alt: "toggle password",
                                className: "signup-input-icon-right password-toggle",
                                onClick: ()=>setShowPassword(!showPassword)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 160,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 151,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 150,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signup-input-group",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "signup-input-field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "signup-input-label",
                                children: "Confirm Password"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 172,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: showConfirmPassword ? 'text' : 'password',
                                className: "signup-input-text",
                                placeholder: "Confirm Password",
                                value: confirmPassword,
                                onChange: (e)=>setConfirmPassword(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 173,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: `/customer/assets/icons/${showConfirmPassword ? 'view.svg' : 'hide.svg'}`,
                                alt: "toggle password",
                                className: "signup-input-icon-right password-toggle",
                                onClick: ()=>setShowConfirmPassword(!showConfirmPassword)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                lineNumber: 180,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 171,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 170,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: "signup-button",
                    onClick: handleManualSignup,
                    disabled: loading,
                    children: loading ? 'Processing...' : 'Sign Up'
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 190,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "signin-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "signin-text",
                            children: "Already have an account? "
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                            lineNumber: 199,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "signin-link",
                            onClick: ()=>router.push('/customer/signin'),
                            children: "Sign In"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                            lineNumber: 200,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 198,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'relative',
                        width: '100%',
                        marginTop: 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "signup-google-button",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: "/customer/assets/icons/google.svg",
                                    alt: "google",
                                    className: "signup-google-icon"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                    lineNumber: 212,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "signup-google-button-text",
                                    children: "Continue with Google"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                                    lineNumber: 217,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                            lineNumber: 211,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            id: "google-btn-container-signup",
                            style: {
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                zIndex: 10
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                            lineNumber: 223,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 209,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
            lineNumber: 117,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
        lineNumber: 116,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a490b397._.js.map