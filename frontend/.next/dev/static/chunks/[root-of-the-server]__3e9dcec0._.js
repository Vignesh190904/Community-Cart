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
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomNavbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/link.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "customer-bottom-nav",
        children: NAV_ITEMS.map((item)=>{
            // Precise active check: 
            // Home only matches exactly, others match by prefix to handle sub-routes
            const is_active = item.href === '/customer/home' ? router.pathname === item.href : router.pathname.startsWith(item.href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                className: `bottom-nav-item ${is_active ? 'active' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
_s(BottomNavbar, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BottomNavbar;
var _c;
__turbopack_context__.k.register(_c, "BottomNavbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/utils/authRedirect.utils.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role-aware redirect resolver
 * Pure function with no side effects
 */ __turbopack_context__.s([
    "getLoginRedirectPath",
    ()=>getLoginRedirectPath
]);
function getLoginRedirectPath(role) {
    if (role === 'admin' || role === 'vendor') {
        return '/login';
    }
    // vendor, admin, or unknown → /login
    return '/customer/signin';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
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
    const [role, set_role] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, set_loading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Apply theme helper (local only)
    const apply_theme = (theme)=>{
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('cc_theme', theme);
    };
    // Identity-only rehydration from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            try {
                const storedUser = localStorage.getItem('auth_user');
                const storedToken = localStorage.getItem('auth_token');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    set_user(parsed);
                    set_role(parsed.role || null);
                }
                if (storedToken) {
                    set_token(storedToken);
                }
            } catch  {
            // Ignore corrupt storage
            } finally{
                set_loading(false);
                if ("TURBOPACK compile-time truthy", 1) {
                    window.__AUTH_READY__ = true;
                }
            }
        }
    }["AuthProvider.useEffect"], []);
    const sign_in = (user_data, token)=>{
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user_data));
        set_user(user_data);
        set_token(token);
        set_role(user_data.role || 'customer');
        // Apply theme from user data on login
        if (user_data.ui_preferences?.theme) {
            apply_theme(user_data.ui_preferences.theme);
        }
    };
    const update_theme = async (theme)=>{
        apply_theme(theme);
        if (user) {
            const updated_user = {
                ...user,
                ui_preferences: {
                    ...user.ui_preferences,
                    theme
                }
            };
            set_user(updated_user);
            localStorage.setItem('auth_user', JSON.stringify(updated_user));
        }
    };
    const sign_out = ()=>{
        const userRole = role || (()=>{
            try {
                const stored = localStorage.getItem('auth_user');
                if (stored) {
                    return JSON.parse(stored).role;
                }
            } catch  {}
            return null;
        })();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set_user(null);
        set_token(null);
        set_role(null);
        const { getLoginRedirectPath } = __turbopack_context__.r("[project]/Desktop/Community-Cart/frontend/src/utils/authRedirect.utils.ts [client] (ecmascript)");
        const redirectPath = getLoginRedirectPath(userRole);
        window.location.href = redirectPath;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            role,
            is_authenticated: Boolean(user),
            loading,
            sign_in,
            sign_out,
            update_theme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx",
        lineNumber: 140,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "z/yvKkXFbY8kbcBLUKaCCNA3g3U=");
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
"[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$BottomNavbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/pages/customer/BottomNavbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/context/AuthContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function CustomerLayout({ children, disablePadding = false, fullWidth = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { is_authenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 1. THEME LOGIC
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerLayout.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const theme = localStorage.getItem('cc_theme');
                const prefersDark = theme === 'dark' || !theme && window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDark(prefersDark);
                if (prefersDark) {
                    document.body.classList.add('theme-dark');
                } else {
                    document.body.classList.remove('theme-dark');
                }
            }
        }
    }["CustomerLayout.useEffect"], []);
    // 2. THEME TOGGLE EXPORT
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerLayout.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                window.toggleCustomerTheme = ({
                    "CustomerLayout.useEffect": ()=>{
                        const newTheme = !isDark;
                        setIsDark(newTheme);
                        if (newTheme) {
                            document.body.classList.add('theme-dark');
                            localStorage.setItem('cc_theme', 'dark');
                        } else {
                            document.body.classList.remove('theme-dark');
                            localStorage.setItem('cc_theme', 'light');
                        }
                    }
                })["CustomerLayout.useEffect"];
            }
        }
    }["CustomerLayout.useEffect"], [
        isDark
    ]);
    // 3. GLOBAL AUTHENTICATION GUARD
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerLayout.useEffect": ()=>{
            // Prevent auto-logout/redirect loop by waiting for AuthContext to finish loading
            if (!loading) {
                if (!is_authenticated) {
                    // No valid session found after revalidation
                    router.replace('/customer/signin');
                }
            // Onboarding redirect logic removed - users navigate directly to Home after signup
            }
        }
    }["CustomerLayout.useEffect"], [
        is_authenticated,
        loading,
        router
    ]);
    // 4. LOADING STATE
    // Show a clean loading screen while AuthContext verifies the token/cookie
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `customer-shell ${fullWidth ? 'full-width' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: `customer-main ${disablePadding ? 'no-padding' : ''} page-transition`,
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/components/customer/CustomerLayout.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$pages$2f$customer$2f$BottomNavbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
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
_s(CustomerLayout, "P7O7vDauSRgCax0smyWmdn3JcU4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CustomerLayout;
var _c;
__turbopack_context__.k.register(_c, "CustomerLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx'\n\nExpected '</', got 'className'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/customer/orders";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/Community-Cart/frontend/src/pages/customer/orders.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__3e9dcec0._.js.map