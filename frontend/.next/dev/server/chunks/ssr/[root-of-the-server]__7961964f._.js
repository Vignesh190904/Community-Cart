module.exports = [
"[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorProfilePage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/services/api.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Community-Cart/frontend/src/components/ui/ToastProvider.tsx [ssr] (ecmascript)");
;
;
;
;
;
function VendorProfilePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { pushToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$components$2f$ui$2f$ToastProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [vendor, setVendor] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [initial, setInitial] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [pwdCurrent, setPwdCurrent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [pwdNew, setPwdNew] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [pwdConfirm, setPwdConfirm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [showCurrent, setShowCurrent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showNew, setShowNew] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showConfirm, setShowConfirm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    // Load vendor data
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        const vendorId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        if ("TURBOPACK compile-time truthy", 1) {
            router.replace('/login');
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        router,
        pushToast
    ]);
    const dirty = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!form || !initial) return false;
        return JSON.stringify(form) !== JSON.stringify(initial);
    }, [
        form,
        initial
    ]);
    const setField = (key, value)=>{
        setForm((prev)=>prev ? {
                ...prev,
                [key]: value
            } : prev);
        setErrors((prev)=>({
                ...prev,
                [String(key)]: ''
            }));
    };
    const validate = ()=>{
        const e = {};
        if (form) {
            // Basic phone checks
            const phoneRe = /^[0-9]{7,15}$/;
            if (form.phone && !phoneRe.test(form.phone)) e.phone = 'Enter a valid phone number';
            if (form.alternatePhone && !phoneRe.test(form.alternatePhone)) e.alternatePhone = 'Enter a valid phone number';
            if (form.whatsapp && !phoneRe.test(form.whatsapp)) e.whatsapp = 'Enter a valid WhatsApp number';
            // Address checks
            if (form.pincode && !/^\d{4,10}$/.test(form.pincode)) e.pincode = 'Enter a valid pincode';
            // Lengths
            if (form.businessDescription.length > 300) e.businessDescription = 'Keep it under 300 characters';
            if (form.operatingHours.length > 100) e.operatingHours = 'Keep it under 100 characters';
            if (form.weeklyOffNote.length > 100) e.weeklyOffNote = 'Keep it under 100 characters';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSave = async ()=>{
        if (!vendor || !form) return;
        if (!validate()) return;
        setSaving(true);
        try {
            const payload = {
                contact: {
                    phone: form.phone || undefined,
                    alternatePhone: form.alternatePhone || undefined,
                    email: vendor.contact?.email,
                    whatsapp: form.whatsapp || undefined
                },
                address: {
                    line1: form.addressLine || undefined,
                    area: form.area || undefined,
                    city: form.city || undefined,
                    state: form.state || undefined,
                    pincode: form.pincode || undefined
                },
                media: {
                    logoUrl: form.mediaLogoUrl || undefined
                },
                extra: {
                    ...vendor.extra || {},
                    businessDescription: form.businessDescription || '',
                    operatingHours: form.operatingHours || '',
                    weeklyOffNote: form.weeklyOffNote || ''
                }
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].vendors.update(vendor._id, payload);
            const extra = updated.extra || {};
            const next = {
                mediaLogoUrl: updated.media?.logoUrl || '',
                phone: updated.contact?.phone || '',
                alternatePhone: updated.contact?.alternatePhone || '',
                whatsapp: updated.contact?.whatsapp || '',
                addressLine: updated.address?.line1 || '',
                area: updated.address?.area || '',
                city: updated.address?.city || '',
                state: updated.address?.state || '',
                pincode: updated.address?.pincode || '',
                businessDescription: extra.businessDescription || '',
                operatingHours: extra.operatingHours || '',
                weeklyOffNote: extra.weeklyOffNote || ''
            };
            setVendor(updated);
            setForm(next);
            setInitial(next);
            pushToast({
                type: 'success',
                message: 'Profile saved successfully'
            });
        } catch (err) {
            pushToast({
                type: 'error',
                message: err.message || 'Failed to save profile'
            });
        } finally{
            setSaving(false);
        }
    };
    const handleCancel = ()=>{
        setErrors({});
        router.replace('/vendor/dashboard');
    };
    const onFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
            const result = reader.result;
            setField('mediaLogoUrl', result);
        };
        reader.readAsDataURL(file);
    };
    const resetPassword = async ()=>{
        const errs = {};
        if (!pwdCurrent) errs.pwdCurrent = 'Enter current password';
        if (!pwdNew || pwdNew.length < 8) errs.pwdNew = 'Minimum 8 characters';
        if (pwdConfirm !== pwdNew) errs.pwdConfirm = 'Passwords do not match';
        setErrors((prev)=>({
                ...prev,
                ...errs
            }));
        if (Object.keys(errs).length) return;
        try {
            const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
            if ("TURBOPACK compile-time truthy", 1) throw new Error('Not authenticated');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Community$2d$Cart$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(token);
            // Implemented in backend: POST /api/auth/change-password
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: pwdCurrent,
                    newPassword: pwdNew
                })
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.message || 'Failed to reset password');
            pushToast({
                type: 'success',
                message: 'Password updated successfully'
            });
            setPwdCurrent('');
            setPwdNew('');
            setPwdConfirm('');
            setShowNew(false);
            setShowConfirm(false);
        } catch (err) {
            pushToast({
                type: 'error',
                message: err.message || 'Password reset failed'
            });
        }
    };
    if (!vendor || !form) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "profile-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "profile-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "section-title",
                    children: "Loading profile…"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                    lineNumber: 237,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
            lineNumber: 235,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "profile-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "section-title",
                        children: "Profile"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "profile-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "avatar",
                                children: [
                                    form.mediaLogoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: form.mediaLogoUrl,
                                        alt: "Vendor logo"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "avatar-placeholder",
                                        "aria-label": "No logo",
                                        children: vendor.storeName?.[0] || 'V'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "btn outline",
                                        htmlFor: "logo-upload",
                                        children: "Upload"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        id: "logo-upload",
                                        type: "file",
                                        accept: "image/*",
                                        onChange: onFileChange
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "profile-ident",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "ident-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-label",
                                                children: "Vendor Name"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 260,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-value",
                                                children: vendor.storeName || '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "ident-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-label",
                                                children: "Vendor Category"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 264,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-value",
                                                children: vendor.vendorType || '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 265,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "ident-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-label",
                                                children: "Login Email"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "ident-value",
                                                children: vendor.contact?.email || '—'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "section-title",
                        children: "Contact Information"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "form-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Primary Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: form.phone,
                                        onChange: (e)=>setField('phone', e.target.value),
                                        "aria-invalid": !!errors.phone
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this),
                                    errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.phone
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 287,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Alternate Phone (optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: form.alternatePhone,
                                        onChange: (e)=>setField('alternatePhone', e.target.value),
                                        "aria-invalid": !!errors.alternatePhone
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this),
                                    errors.alternatePhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.alternatePhone
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 297,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "WhatsApp (optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: form.whatsapp,
                                        onChange: (e)=>setField('whatsapp', e.target.value),
                                        "aria-invalid": !!errors.whatsapp
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    errors.whatsapp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.whatsapp
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 307,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "section-title",
                        children: "Address"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "form-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Address Line"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 317,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.addressLine,
                                        onChange: (e)=>setField('addressLine', e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Area / Locality"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.area,
                                        onChange: (e)=>setField('area', e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 324,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "City"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.city,
                                        onChange: (e)=>setField('city', e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "State"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.state,
                                        onChange: (e)=>setField('state', e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Pincode"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.pincode,
                                        onChange: (e)=>setField('pincode', e.target.value),
                                        "aria-invalid": !!errors.pincode
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    errors.pincode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.pincode
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 356,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "section-title",
                        children: "Business Meta (Optional)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 363,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "form-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Short Business Description"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 366,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        value: form.businessDescription,
                                        onChange: (e)=>setField('businessDescription', e.target.value),
                                        "aria-invalid": !!errors.businessDescription
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 367,
                                        columnNumber: 13
                                    }, this),
                                    errors.businessDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.businessDescription
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 372,
                                        columnNumber: 44
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Operating Hours"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.operatingHours,
                                        onChange: (e)=>setField('operatingHours', e.target.value),
                                        "aria-invalid": !!errors.operatingHours
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this),
                                    errors.operatingHours && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.operatingHours
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 382,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Weekly Off / Holiday Note"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 385,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.weeklyOffNote,
                                        onChange: (e)=>setField('weeklyOffNote', e.target.value),
                                        "aria-invalid": !!errors.weeklyOffNote
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 386,
                                        columnNumber: 13
                                    }, this),
                                    errors.weeklyOffNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.weeklyOffNote
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 392,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 362,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-actions right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "btn outline",
                        onClick: handleSave,
                        disabled: !dirty || saving,
                        children: saving ? 'Saving…' : 'Save Changes'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "btn outline danger",
                        onClick: handleCancel,
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "profile-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "section-title",
                        children: "Reset Password"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "form-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Current Password"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 412,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "password-input",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: showCurrent ? 'text' : 'password',
                                                autoComplete: "new-password",
                                                readOnly: true,
                                                onFocus: (e)=>e.currentTarget.removeAttribute('readonly'),
                                                value: pwdCurrent,
                                                onChange: (e)=>setPwdCurrent(e.target.value),
                                                "aria-invalid": !!errors.pwdCurrent
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 414,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "eye-btn",
                                                "aria-label": showCurrent ? 'Hide password' : 'Show password',
                                                onClick: ()=>setShowCurrent((s)=>!s),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 24 24",
                                                    className: "eye-icon",
                                                    "aria-hidden": "true",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                        d: "M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 82
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this),
                                    errors.pwdCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.pwdCurrent
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 427,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 411,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "New Password"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 430,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "password-input",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: showNew ? 'text' : 'password',
                                                autoComplete: "new-password",
                                                readOnly: true,
                                                onFocus: (e)=>e.currentTarget.removeAttribute('readonly'),
                                                value: pwdNew,
                                                onChange: (e)=>setPwdNew(e.target.value),
                                                "aria-invalid": !!errors.pwdNew
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 432,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "eye-btn",
                                                "aria-label": showNew ? 'Hide password' : 'Show password',
                                                onClick: ()=>setShowNew((s)=>!s),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 24 24",
                                                    className: "eye-icon",
                                                    "aria-hidden": "true",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                        d: "M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 82
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 441,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 431,
                                        columnNumber: 13
                                    }, this),
                                    errors.pwdNew && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.pwdNew
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 445,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 429,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "form-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Confirm New Password"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 448,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "password-input",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: showConfirm ? 'text' : 'password',
                                                autoComplete: "new-password",
                                                readOnly: true,
                                                onFocus: (e)=>e.currentTarget.removeAttribute('readonly'),
                                                value: pwdConfirm,
                                                onChange: (e)=>setPwdConfirm(e.target.value),
                                                "aria-invalid": !!errors.pwdConfirm
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 450,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "eye-btn",
                                                "aria-label": showConfirm ? 'Hide password' : 'Show password',
                                                onClick: ()=>setShowConfirm((s)=>!s),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 24 24",
                                                    className: "eye-icon",
                                                    "aria-hidden": "true",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                        d: "M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                        lineNumber: 460,
                                                        columnNumber: 82
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                                lineNumber: 459,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, this),
                                    errors.pwdConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "field-error",
                                        children: errors.pwdConfirm
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                        lineNumber: 463,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 410,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "profile-actions right",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "btn outline",
                            onClick: resetPassword,
                            disabled: !pwdCurrent || !pwdNew || !pwdConfirm,
                            children: "Update Password"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                            lineNumber: 467,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                        lineNumber: 466,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Community-Cart/frontend/src/pages/vendor/profile.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7961964f._.js.map