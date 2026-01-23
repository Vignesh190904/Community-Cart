(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
    if (role === 'customer') {
        return '/customer/signin';
    }
    // vendor, admin, or unknown → /login
    return '/login';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Community-Cart_frontend_src_utils_authRedirect_utils_ts_39d25edd._.js.map