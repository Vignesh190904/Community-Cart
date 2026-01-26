

// Global flag to track if we've already shown the "offline" toast in this session/load.
let hasShownOfflineToast = false;

// Custom error to silently suppress in Customer UI
export class SilentNetworkError extends Error {
    constructor() {
        super('SilentNetworkError');
        this.name = 'SilentNetworkError';
    }
}

/**
 * A wrapper around `fetch` for Customer UI that handles infinite loading on backend failure.
 * 
 * Behavior on NETWORK ERROR (e.g. backend down):
 * 1. Dispatches 'cc-backend-offline' event (handled by ToastProvider).
 * 2. Returns a Promise that NEVER resolves. 
 *    - This keeps `await customerFetch(...)` hanging.
 *    - React state remains `loading={true}`.
 *    - Skeletons stay visible indefinitely.
 * 
 * Behavior on SUCCESS or valid HTTP response (even 4xx/5xx):
 * - Returns response normaly.
 */
export async function customerFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
        const response = await fetch(input, init);
        return response;
    } catch (error: any) {
        // Detect Network Error (Chrome often says "Failed to fetch")
        if (error instanceof TypeError && error.message === 'Failed to fetch') {

            // 1. Dispatch Custom Event (Listening in ToastProvider)
            if (!hasShownOfflineToast) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('cc-backend-offline'));
                }
                hasShownOfflineToast = true;
            }

            // 2. Suppress Console Noise
            // We do NOT log this error to console.error to keep it clean.

            // 3. Infinite Loading Magic
            // Return a promise that never resolves.
            return new Promise(() => {
                // Intentionally empty.
                // Caller (e.g., await customerFetch()) will hang here forever.
                // Loading spinners/skeletons will persist.
            });
        }

        // Re-throw other unexpected errors (extensions interfering, etc.)
        throw error;
    }
}
