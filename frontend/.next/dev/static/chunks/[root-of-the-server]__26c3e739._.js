(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, set_user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, set_token] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, set_loading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load auth state ONCE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const stored_token = localStorage.getItem('auth_token');
            const stored_user = localStorage.getItem('auth_user');
            if (stored_token && stored_user) {
                set_token(stored_token);
                set_user(JSON.parse(stored_user));
            }
            set_loading(false);
        }
    }["AuthProvider.useEffect"], []);
    const sign_in = (user_data, token)=>{
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user_data));
        set_user(user_data);
        set_token(token);
    };
    const sign_out = ()=>{
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set_user(null);
        set_token(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            is_authenticated: Boolean(token),
            loading,
            sign_in,
            sign_out
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx",
        lineNumber: 56,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "a7E4TJGNe5TFGZQ0VDw1rGeuG9U=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiCall",
    ()=>apiCall,
    "apiGet",
    ()=>apiGet,
    "apiPost",
    ()=>apiPost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
async function apiCall(endpoint, options = {}) {
    try {
        // JWT Authentication: Attached from localStorage
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('auth_token') : "TURBOPACK unreachable";
        const authHeader = token ? {
            'Authorization': `Bearer ${token}`
        } : {};
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/flows/signup.flow.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSignupData",
    ()=>clearSignupData,
    "getSignupData",
    ()=>getSignupData,
    "startSignup",
    ()=>startSignup,
    "submitMobile",
    ()=>submitMobile,
    "verifyEmailOtp",
    ()=>verifyEmailOtp,
    "verifyMobileOtp",
    ()=>verifyMobileOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [client] (ecmascript)");
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
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/start', {
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
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/verify-email', {
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
    // Navigate to mobile number collection
    callbacks.onNavigate?.('/customer/verify-mobile', {
        email,
        intent: 'manual_signup'
    });
}
async function submitMobile(email, mobile, callbacks) {
    if (!email || !mobile) {
        callbacks.onError?.('Email and mobile number are required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/add-mobile', {
        email,
        mobile
    });
    if (result.error) {
        if (result.errorCode === 'MOBILE_EXISTS') {
            callbacks.onError?.('Mobile number already registered');
            return;
        }
        if (result.errorCode === 'EMAIL_NOT_VERIFIED') {
            callbacks.onError?.('Email not verified. Please verify your email first.');
            return;
        }
        if (result.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }
    // Update storage with mobile
    const signupData = sessionStorage.getItem(STORAGE_KEY_SIGNUP);
    if (signupData) {
        const data = JSON.parse(signupData);
        sessionStorage.setItem(STORAGE_KEY_SIGNUP, JSON.stringify({
            ...data,
            mobile
        }));
    }
    // Stay on same page or navigate to mobile OTP verification
    // (UI will show OTP input field)
    callbacks.onNavigate?.('/customer/verify-mobile', {
        email,
        mobile,
        intent: 'manual_signup',
        step: 'verify-otp'
    });
}
async function verifyMobileOtp(email, mobile, otp, callbacks) {
    if (!email || !mobile || !otp) {
        callbacks.onError?.('Email, mobile, and OTP are required');
        return;
    }
    // First, verify mobile OTP
    const verifyResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/verify-mobile', {
        email,
        mobile,
        otp
    });
    if (verifyResult.error) {
        if (verifyResult.errorCode === 'INVALID_OTP') {
            callbacks.onError?.('Invalid or expired OTP. Please try again.');
            return;
        }
        if (verifyResult.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
            return;
        }
        callbacks.onError?.(verifyResult.error);
        return;
    }
    // Then, finalize signup
    const finalizeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/signup/finalize', {
        email
    });
    if (finalizeResult.error) {
        if (finalizeResult.errorCode === 'VERIFICATION_INCOMPLETE') {
            callbacks.onError?.('Email or mobile not verified. Please complete verification.');
            return;
        }
        callbacks.onError?.(finalizeResult.error);
        return;
    }
    // Clear temporary storage
    sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
    // Success! Session cookie is now set by backend
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/flows/google-signup.flow.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearGoogleSignupData",
    ()=>clearGoogleSignupData,
    "getGoogleSignupData",
    ()=>getGoogleSignupData,
    "getGoogleToken",
    ()=>getGoogleToken,
    "startGoogleSignup",
    ()=>startGoogleSignup,
    "submitGoogleMobile",
    ()=>submitGoogleMobile,
    "verifyGoogleEmailOtp",
    ()=>verifyGoogleEmailOtp,
    "verifyGoogleMobileOtp",
    ()=>verifyGoogleMobileOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/utils/api.utils.ts [client] (ecmascript)");
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
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/start', {
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
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/verify-email', {
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
    // Navigate to mobile number collection
    callbacks.onNavigate?.('/customer/verify-mobile', {
        email,
        intent: 'google_signup'
    });
}
async function submitGoogleMobile(email, mobile, callbacks) {
    if (!email || !mobile) {
        callbacks.onError?.('Email and mobile number are required');
        return;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/add-mobile', {
        email,
        mobile
    });
    if (result.error) {
        if (result.errorCode === 'MOBILE_EXISTS') {
            callbacks.onError?.('Mobile number already registered');
            return;
        }
        if (result.errorCode === 'EMAIL_NOT_VERIFIED') {
            callbacks.onError?.('Email not verified. Please verify your email first.');
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
    // Update storage with mobile
    const signupData = sessionStorage.getItem(STORAGE_KEY_GOOGLE_SIGNUP);
    if (signupData) {
        const data = JSON.parse(signupData);
        sessionStorage.setItem(STORAGE_KEY_GOOGLE_SIGNUP, JSON.stringify({
            ...data,
            mobile
        }));
    }
    // Navigate to mobile OTP verification
    callbacks.onNavigate?.('/customer/verify-mobile', {
        email,
        mobile,
        intent: 'google_signup',
        step: 'verify-otp'
    });
}
async function verifyGoogleMobileOtp(email, mobile, otp, callbacks) {
    if (!email || !mobile || !otp) {
        callbacks.onError?.('Email, mobile, and OTP are required');
        return;
    }
    // First, verify mobile OTP
    const verifyResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/verify-mobile', {
        email,
        mobile,
        otp
    });
    if (verifyResult.error) {
        if (verifyResult.errorCode === 'INVALID_OTP') {
            callbacks.onError?.('Invalid or expired OTP. Please try again.');
            return;
        }
        if (verifyResult.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            clearGoogleSignupData();
            return;
        }
        callbacks.onError?.(verifyResult.error);
        return;
    }
    // Then, finalize signup
    const finalizeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$utils$2f$api$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/auth/customer/google/signup/finalize', {
        email
    });
    if (finalizeResult.error) {
        if (finalizeResult.errorCode === 'VERIFICATION_INCOMPLETE') {
            callbacks.onError?.('Email or mobile not verified. Please complete verification.');
            return;
        }
        callbacks.onError?.(finalizeResult.error);
        return;
    }
    // Clear temporary storage
    clearGoogleSignupData();
    // Success! Session cookie is now set by backend
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signup$2e$flow$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/signup.flow.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signup$2e$flow$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/flows/google-signup.flow.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function SignUp() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { is_authenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [name, set_name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [email, set_email] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, set_password] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirm_password, set_confirm_password] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, set_error] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, set_loading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const google_initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 1. MANUAL SIGNUP START
    const handle_manual_signup = ()=>{
        if (password !== confirm_password) {
            set_error('Passwords do not match');
            return;
        }
        set_loading(true);
        set_error('');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$signup$2e$flow$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["startSignup"])({
            name,
            email,
            password
        }, {
            onSuccess: ()=>{
                router.push('/customer/home');
            },
            onError: (message)=>{
                set_error(message);
                set_loading(false);
            },
            onNavigate: (path, query)=>{
                router.push({
                    pathname: path,
                    query
                });
                set_loading(false);
            }
        });
    };
    // 2. GOOGLE SIGNUP START
    const handle_google_response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SignUp.useCallback[handle_google_response]": (response)=>{
            set_loading(true);
            set_error('');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$flows$2f$google$2d$signup$2e$flow$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["startGoogleSignup"])(response.credential, {
                onSuccess: {
                    "SignUp.useCallback[handle_google_response]": ()=>{
                        router.push('/customer/home');
                    }
                }["SignUp.useCallback[handle_google_response]"],
                onError: {
                    "SignUp.useCallback[handle_google_response]": (message)=>{
                        set_error(message);
                        set_loading(false);
                    }
                }["SignUp.useCallback[handle_google_response]"],
                onNavigate: {
                    "SignUp.useCallback[handle_google_response]": (path, query)=>{
                        router.push({
                            pathname: path,
                            query
                        });
                        set_loading(false);
                    }
                }["SignUp.useCallback[handle_google_response]"]
            });
        }
    }["SignUp.useCallback[handle_google_response]"], [
        router
    ]);
    // Google Init
    const init_google = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SignUp.useCallback[init_google]": ()=>{
            if (is_authenticated) return;
            const client_id = ("TURBOPACK compile-time value", "593072744898-audf3340cfc8n078bvau1mn8kberm2jj.apps.googleusercontent.com");
            const container = document.getElementById('google-btn-container-signup');
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
        }
    }["SignUp.useCallback[init_google]"], [
        handle_google_response,
        is_authenticated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignUp.useEffect": ()=>{
            // Force a small delay to ensure DOM is ready
            const timer = setTimeout({
                "SignUp.useEffect.timer": ()=>{
                    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.google) {
                        init_google();
                    }
                }
            }["SignUp.useEffect.timer"], 100);
            return ({
                "SignUp.useEffect": ()=>clearTimeout(timer)
            })["SignUp.useEffect"];
        }
    }["SignUp.useEffect"], [
        init_google
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "signup-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "signup-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "signup-title",
                    children: "Sign Up"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 107,
                    columnNumber: 17
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'red',
                        textAlign: 'center'
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 108,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: name,
                        onChange: (e)=>set_name(e.target.value),
                        placeholder: "Name"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 111,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 110,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "email",
                        value: email,
                        onChange: (e)=>set_email(e.target.value),
                        placeholder: "Email"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 114,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "password",
                        value: password,
                        onChange: (e)=>set_password(e.target.value),
                        placeholder: "Password"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                        lineNumber: 117,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "signup-input-field",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "password",
                        value: confirm_password,
                        onChange: (e)=>set_confirm_password(e.target.value),
                        placeholder: "Confirm Password"
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handle_manual_signup,
                    disabled: loading,
                    className: "signup-button",
                    children: loading ? 'Processing...' : 'Sign Up'
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "google-btn-container-signup",
                    style: {
                        marginTop: '20px'
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
                    lineNumber: 127,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
            lineNumber: 106,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx",
        lineNumber: 105,
        columnNumber: 9
    }, this);
}
_s(SignUp, "bxqcatNr97gJQ5Vf6oGgSnwmiqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = SignUp;
var _c;
__turbopack_context__.k.register(_c, "SignUp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/customer/signup";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/signup.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__26c3e739._.js.map