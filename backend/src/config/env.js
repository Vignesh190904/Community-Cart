import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend root (two levels up from src/config)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const getEnv = (key, fallback) => {
    const value = process.env[key];
    if (value === undefined) {
        if (fallback === undefined) {
            // For production build/start, we might want to strict fail, 
            // but for now let's strict fail if it's truly critical like MONGO_URI
            // Actually, the user asked to load process.env.* so we should just return what we find or fallback.
            // But let's add a warning if missing and no fallback.
            console.warn(`[WARN] Missing env var: ${key}`);
            return undefined;
        }
        return fallback;
    }
    return value;
};

// Critical Variables - Fail if missing (optional but recommended)
if (!process.env.MONGO_URI) {
    console.error('[CRITICAL] MONGO_URI is missing');
}

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    FRONTEND_URL: (() => {
        if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
            throw new Error('FATAL: FRONTEND_URL is required in production.');
        }
        return process.env.FRONTEND_URL || 'http://localhost:4646';
    })(),
    client_url: process.env.CLIENT_URL, // Kept for legacy if valid, but FRONTEND_URL is preferred

    JWT: {
        SECRET: process.env.JWT_SECRET || 'default_secret_change_me',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d'
    },

    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET
    },

    SMTP: {
        HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
        PORT: parseInt(process.env.SMTP_PORT || '587'),
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS,
        FROM: process.env.SMTP_FROM,
        SECURE: process.env.SMTP_SECURE === 'true'
    },

    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID
    }
};

export default ENV;
