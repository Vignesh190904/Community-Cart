import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/config/db.js';
import Vendor from '../src/models/Vendor.model.js';

// Load dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const auditVendorMedia = async () => {
    const counts = {
        TOTAL: 0,
        logoUrl: {
            BASE64_JPEG: 0, BASE64_PNG: 0, BASE64_WEBP: 0, HTTP_URL: 0, CLOUDINARY_URL: 0, NULL: 0, UNKNOWN: 0
        },
        bannerUrl: {
            BASE64_JPEG: 0, BASE64_PNG: 0, BASE64_WEBP: 0, HTTP_URL: 0, CLOUDINARY_URL: 0, NULL: 0, UNKNOWN: 0
        },
        images: {
            BASE64_JPEG: 0, BASE64_PNG: 0, BASE64_WEBP: 0, HTTP_URL: 0, CLOUDINARY_URL: 0, NULL: 0, UNKNOWN: 0
        }
    };

    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        const vendors = await Vendor.find({});
        counts.TOTAL = vendors.length;
        console.log(`🔍 Auditing ${counts.TOTAL} vendors...\n`);

        const classifyImage = (image) => {
            if (!image) return 'NULL';
            if (typeof image !== 'string') return 'UNKNOWN';

            if (image.includes('res.cloudinary.com')) return 'CLOUDINARY_URL';
            if (image.startsWith('http')) return 'HTTP_URL';

            const trimmed = image.trim();
            // Check Data URI first
            if (trimmed.startsWith('data:image/jpeg;base64,') || trimmed.startsWith('data:image/jpg;base64,')) return 'BASE64_JPEG';
            if (trimmed.startsWith('data:image/png;base64,')) return 'BASE64_PNG';
            if (trimmed.startsWith('data:image/webp;base64,')) return 'BASE64_WEBP';

            // Check Magic Numbers
            if (trimmed.startsWith('/9j/')) return 'BASE64_JPEG';
            if (trimmed.startsWith('iVBOR')) return 'BASE64_PNG';
            if (trimmed.startsWith('UklGR')) return 'BASE64_WEBP';
            if (trimmed.startsWith('R0lGOD')) return 'UNKNOWN'; // Counting GIF as unknown for now or map to GIF if needed, request said unknown/base64 generic but let's stick to requested keys

            return 'UNKNOWN';
        };

        for (const vendor of vendors) {
            // Check logoUrl
            counts.logoUrl[classifyImage(vendor.logoUrl)]++;

            // Check bannerUrl
            counts.bannerUrl[classifyImage(vendor.bannerUrl)]++;

            // Check images array if exists (it might not exist on model, but checking data)
            if (Array.isArray(vendor.images) && vendor.images.length > 0) {
                for (const img of vendor.images) {
                    counts.images[classifyImage(img)]++;
                }
            }
        }

        console.log('--- Vendor Media Type Report ---');
        console.log(`Total Vendors: ${counts.TOTAL}`);

        console.log('\nLogo:');
        Object.entries(counts.logoUrl).forEach(([key, val]) => {
            if (val > 0) console.log(`${key}: ${val}`);
        });

        console.log('\nBanner:');
        Object.entries(counts.bannerUrl).forEach(([key, val]) => {
            if (val > 0) console.log(`${key}: ${val}`);
        });

        console.log('\nImages Array:');
        let hasImages = false;
        Object.entries(counts.images).forEach(([key, val]) => {
            if (val > 0) {
                console.log(`${key}: ${val}`);
                hasImages = true;
            }
        });
        if (!hasImages) console.log('No images in array or array empty');

        console.log('--------------------------------');

    } catch (error) {
        console.error('❌ Error during audit:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

auditVendorMedia();
