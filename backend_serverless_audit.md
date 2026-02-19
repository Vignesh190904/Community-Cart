# Backend Serverless Compatibility Audit

## 1. Architecture Type
**Verdict:** 🟢 **Ready (mostly)**
- **Structure:** `app.js` exports the Express `app` instance, which is compatible with Vercel's serverless wrapper.
- **Entry Point:** `server.js` is a standard standalone server wrapper. You will need a new `api/index.js` (or similar) to bridge Vercel to `app.js`.

## 2. File System Dependencies
**Verdict:** 🟡 **Minor Adjustments Needed**

| File | Issue | Serverless Impact |
| :--- | :--- | :--- |
| `backend/app.js` | `app.use('/api/uploads', express.static(...))` | **BROKEN.** Local uploads folder will not exist on Vercel. Any overlapping images will 404. |
| `backend/src/config/uploadConfig.js` | Uses `multer.diskStorage` | **DEAD CODE.** Safe to ignore/delete. Active routes use `memoryUpload.js`. |
| `backend/src/controllers/customer.controller.js` | `fs.unlinkSync` for cleanup | **SAFE.** Wrapped in `fs.existsSync`. Will likely just no-op on Vercel. |

**Recommendation:**
- Remove the `express.static` line in `app.js` once all images are migrated to Cloudinary.
- Delete `backend/src/config/uploadConfig.js` to avoid confusion.

## 3. MongoDB Safety
**Verdict:** 🟢 **Safe**
- **Connection:** `connectDB` uses a global `isConnected` variable to prevent connection spikes on hot reloads. This is a basic but effective serverless pattern.
- **State:** No in-memory session stores found (uses JWT/stateless auth).

## 4. Environment Variables
**Verdict:** 🟢 **Ready**
- **Required Vars:** `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`.
- **Port:** `PORT` is used in `server.js` but ignored by Vercel (which manages routing).
- **CORS:** Dynamic origin based on `NODE_ENV` and `FRONTEND_URL`. Compatible.

## 5. Payload Safety
**Verdict:** 🟡 **Borderline**
- **Config:** `app.use(express.json({ limit: '5mb' }))`
- **Vercel Limit:** Serverless functions have a **4.5MB** request body limit.
- **Risk:** A 4.8MB image upload will fail on Vercel even if Express allows it.
- **Fix:** Lower limit to `4mb` to be safe, or stick to front-end compression.

## 6. Performance Risks
**Verdict:** 🟢 **Low Risk**
- **Long-running tasks:** No `setInterval` or `cron` jobs found.
- **Heavy Processing:** Image resizing/compression is handled by Cloudinary (if implemented correctly) or simple buffer uploads.

## 7. Blockers
None. The code is surprisingly distinct from local filesystem logic.

## 8. Final Verdict & Recommendations
**Score:** 9/10

### Steps to Deploy:
1.  **Create Vercel Entry Point:**
    Create `/backend/api/index.js`:
    ```javascript
    import app from '../app.js';
    export default app;
    ```
2.  **Config Vercel:**
    Create `vercel.json` with rewrites to route `/api/*` to `api/index.js`.
3.  **Cleanup (Optional but recommended):**
    -   Delete `uploadConfig.js`.
    -   Remove static `uploads` serving from `app.js`.
