
import { verifyToken } from './src/utils/jwt.utils.js';
import dotenv from 'dotenv';
dotenv.config();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDQwZGFiZDM5YWNmYjZlZjg5MDllNSIsInJvbGUiOiJ2ZW5kb3IiLCJpYXQiOjE3NjkwOTUzODksImV4cCI6MTc3MTY4NzM4OX0.sQ37A4_DC02YFMu4KBLKggmGTktUC4DErcM-itTBDRU";

console.log("JWT_SECRET:", process.env.JWT_SECRET);

try {
    const decoded = verifyToken(token);
    console.log("✅ Decoded successfully:", decoded);
} catch (error) {
    console.log("❌ Verification failed:", error.message);
}
