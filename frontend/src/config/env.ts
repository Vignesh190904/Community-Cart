/**
 * Centralized Environment Configuration
 * Validates and exports environment variables.
 */

const getEnvVar = (key: string, value: string | undefined, fallback: string): string => {
    // 1. If value exists, return it
    if (value) {
        return value;
    }

    // 2. If production, fail fast
    if (process.env.NODE_ENV === 'production') {
        throw new Error(`${key} is not defined in environment variables`);
    }

    // 3. If development/test, warn and use fallback
    console.warn(`[EnvConfig] ${key} is missing. Falling back to "${fallback}"`);
    return fallback;
};

// Export validated variables
// Note: We pass process.env.NEXT_PUBLIC_API_URL explicitly to allow Next.js to inline it at build time
export const API_BASE = getEnvVar(
    'NEXT_PUBLIC_API_URL',
    process.env.NEXT_PUBLIC_API_URL,
    'http://localhost:5000'
);
