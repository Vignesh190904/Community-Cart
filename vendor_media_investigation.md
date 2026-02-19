# Vendor Media Storage Investigation Report

## 1. Executive Summary
**Current Status:** Safe but fragile.
- **Data:** All 7 existing vendors have `NULL` media fields. **No immediate migration is needed.**
- **Architecture:** The system is designed to store images as **Base64 strings** in the database (via Vendor Portal) or **URLs** (via Admin Portal).
- **Risk:** High risk of database bloating if vendors start uploading logos/banners via their portal.

## 2. Database Schema & Data
**Model:** `backend/src/models/Vendor.model.js`
| Field | Type | Storage Mechanism | Current Status |
| :--- | :--- | :--- | :--- |
| `media.logoUrl` | String | Base64 (planned) / URL | **100% NULL** |
| `media.bannerUrl` | String | Base64 (planned) / URL | **100% NULL** |
| `media.images` | [String] | Array of Strings | **Empty** |

**Audit Findings:**
- Total Vendors: 7
- Media Fields Populated: 0

## 3. Upload Mechanisms

### A. Vendor Portal (`frontend/src/pages/vendor/profile.tsx`)
- **UI:** `<input type="file" accept="image/*" />`
- **Logic:** Uses `FileReader` to convert the file to **Base64 Data URI**.
- **Payload:** Sends the huge Base64 string directly in the `PUT /api/vendors/:id` body.
- **Backend:** `updateVendor` controller blindly saves this string to MongoDB.
- **Verdict:** **Antipattern.** This will cause performance issues identical to the Product images.

### B. Admin Portal (`frontend/src/pages/admin/vendors.tsx`)
- **UI:** `<input type="url" />`
- **Logic:** Expects admin to paste a full URL. No file upload capability.
- **Verdict:** Safe but inconvenient. Admins have no way to upload files directly.

## 4. Backend File System
- `backend/uploads`: Contains `profile-pics` (likely for Customer/User profiles).
- **No vendor-specific folders exist.**
- **No backend logic exists** to write vendor images to disk.

## 5. Performance & Limit Risks (Vercel/Atlas)
- **Payload Size:** Base64 increases file size by ~33%. A 2MB image becomes ~2.7MB text.
- **Vercel Serverless Function Limit:** 4.5MB payload limit.
- **Risk:** Vendors uploading high-res logos/banners will likely hit **HTTP 413 Payload Too Large** or Vercel timeouts.
- **Mongo Atlas:** Storing large strings degrades query performance and increases storage costs.

## 6. Recommendations

Since the data is currently empty, we have a clean slate to implement the **correct solution** without a complex migration.

### Immediate Action (Phase 2 Recommendation)
1.  **Backend:** Create a specific `PUT /api/vendors/:id/logo` (or generic upload) endpoint that accepts `multipart/form-data`, uploads to Cloudinary, and saves the *URL*.
2.  **Frontend (Vendor Portal):** Refactor `profile.tsx` to upload the file to this new endpoint instead of converting to Base64.
3.  **Frontend (Admin Portal):** Add file upload capability similar to the Vendor Portal.

### Migration Logic
- **None required** (0 records to migrate).
