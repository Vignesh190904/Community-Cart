import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/config/db.js';
import Product from '../src/models/Product.model.js';

// Load dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const auditImageTypes = async () => {
    const counts = {
        TOTAL: 0,
        JPEG: 0,
        PNG: 0,
        WEBP: 0,
        GIF: 0,
        SVG: 0,
        URL: 0,
        CLOUDINARY: 0,
        NULL: 0,
        UNKNOWN: 0
    };

    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        const products = await Product.find({});
        counts.TOTAL = products.length;
        console.log(`🔍 Auditing ${counts.TOTAL} products...\n`);

        for (const product of products) {
            const image = product.image;

            if (!image) {
                counts.NULL++;
                continue;
            }

            if (typeof image !== 'string') {
                console.warn(`⚠️ Warning: Product ${product._id} image is not a string.`);
                counts.UNKNOWN++;
                continue;
            }

            if (image.includes('res.cloudinary.com')) {
                counts.CLOUDINARY++;
                continue;
            }

            if (image.startsWith('http')) {
                counts.URL++;
                continue;
            }

            // Base64 Detection
            // Check for data URI prefix first
            if (image.startsWith('data:image/')) {
                if (image.includes('data:image/jpeg;base64,') || image.includes('data:image/jpg;base64,')) {
                    counts.JPEG++;
                } else if (image.includes('data:image/png;base64,')) {
                    counts.PNG++;
                } else if (image.includes('data:image/webp;base64,')) {
                    counts.WEBP++;
                } else if (image.includes('data:image/gif;base64,')) {
                    counts.GIF++;
                } else if (image.includes('data:image/svg+xml;base64,')) {
                    counts.SVG++;
                } else {
                    counts.UNKNOWN++;
                    console.log(`❓ Unknown data URI type for product ${product._id}: ${image.substring(0, 30)}...`);
                }
                continue;
            }

            // Check for raw Base64 magic numbers (if no data URI prefix)
            // Remove any leading whitespace just in case
            const cleanImage = image.trim();

            if (cleanImage.startsWith('/9j/')) {
                counts.JPEG++;
            } else if (cleanImage.startsWith('iVBOR')) {
                counts.PNG++;
            } else if (cleanImage.startsWith('UklGR')) {
                counts.WEBP++;
            } else if (cleanImage.startsWith('R0lGOD')) {
                counts.GIF++;
            } else if (cleanImage.includes('<svg')) {
                counts.SVG++;
            } else {
                counts.UNKNOWN++;
                // console.log(`❓ Unknown format for product ${product._id}: ${cleanImage.substring(0, 20)}...`);
            }
        }

        console.log('--- Product Image Type Report ---');
        console.log(`Total Products: ${counts.TOTAL}`);
        console.log(`JPEG: ${counts.JPEG}`);
        console.log(`PNG: ${counts.PNG}`);
        console.log(`WEBP: ${counts.WEBP}`);
        console.log(`GIF: ${counts.GIF}`);
        console.log(`SVG: ${counts.SVG}`);
        console.log(`URL: ${counts.URL}`);
        console.log(`CLOUDINARY: ${counts.CLOUDINARY}`);
        console.log(`NULL: ${counts.NULL}`);
        console.log(`UNKNOWN: ${counts.UNKNOWN}`);
        console.log('---------------------------------');

    } catch (error) {
        console.error('❌ Error during audit:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

auditImageTypes();
