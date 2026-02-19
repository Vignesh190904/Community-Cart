const isProd = process.env.NODE_ENV === "production";

export const API_BASE = isProd
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export const buildApiUrl = (path: string) => {
    return `${API_BASE}${path}`;
};
