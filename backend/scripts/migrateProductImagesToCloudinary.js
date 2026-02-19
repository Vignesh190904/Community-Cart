import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/config/db.js';
import Product from '../src/models/Product.model.js';
import cloudinary from '../src/config/cloudinary.js';

// Load dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const migrateImages = async () => {
    let counters = {
        total: 0,
        migrated: 0,
        skipped_webp: 0,
        skipped_cloudinary: 0,
        skipped_unknown: 0,
        errors: 0
    };
    let errorDetails = [];

    try {
        await connectDB();
        console.log('✅ MongoDB connected');
        console.log('🔄 Starting migration (JPEG/PNG only)...');

        const products = await Product.find({});
        counters.total = products.length;
        console.log(`📦 Found ${counters.total} products to process.\n`);

        for (const product of products) {
            try {
                const image = product.image;

                if (!image) {
                    counters.skipped_unknown++;
                    continue;
                }

                // Check if already on Cloudinary
                if (image.includes('res.cloudinary.com')) {
                    counters.skipped_cloudinary++;
                    continue;
                }

                // Identify Image Type & Prepare Data URI
                let imageToUpload = null;
                let type = 'UNKNOWN';
                const trimmedImage = image.trim();

                // 1. Check existing Data URI prefixes
                if (trimmedImage.startsWith('data:image/jpeg;base64,') || trimmedImage.startsWith('data:image/jpg;base64,')) {
                    type = 'JPEG';
                    imageToUpload = trimmedImage;
                } else if (trimmedImage.startsWith('data:image/png;base64,')) {
                    type = 'PNG';
                    imageToUpload = trimmedImage;
                } else if (trimmedImage.startsWith('data:image/webp;base64,')) {
                    type = 'WEBP';
                }
                // 2. Check Magic Numbers (Raw Base64)
                else if (trimmedImage.startsWith('/9j/')) {
                    type = 'JPEG';
                    imageToUpload = `data:image/jpeg;base64,${trimmedImage}`;
                } else if (trimmedImage.startsWith('iVBOR')) {
                    type = 'PNG';
                    imageToUpload = `data:image/png;base64,${trimmedImage}`;
                } else if (trimmedImage.startsWith('UklGR')) {
                    type = 'WEBP';
                }

                // Handle Types
                if (type === 'WEBP') {
                    console.log(`⚠️ Skipping WEBP product: ${product.name}`);
                    counters.skipped_webp++;
                    continue;
                } else if (type === 'UNKNOWN') {
                    console.log(`❓ Skipping Unknown format product: ${product.name}`);
                    counters.skipped_unknown++;
                    continue;
                }

                // Upload JPEG/PNG
                if (imageToUpload) {
                    console.log(`🚀 Uploading ${type}: ${product.name}...`);

                    const uploadResponse = await cloudinary.uploader.upload(imageToUpload, {
                        folder: 'products',
                        resource_type: 'image'
                    });

                    // Update Product
                    product.image = uploadResponse.secure_url;
                    await product.save();

                    console.log(`✅ Migrated: ${product.name}`);
                    counters.migrated++;
                }

            } catch (err) {
                console.error(`❌ Error processing product ${product._id}:`, err.message);
                counters.errors++;
                errorDetails.push({ id: product._id, name: product.name, error: err.message });
            }
        }

        // Final Summary
        console.log('\n--- Migration Summary ---');
        console.log(`Total Products: ${counters.total}`);
        console.log(`Migrated: ${counters.migrated}`);
        console.log(`Skipped WEBP: ${counters.skipped_webp}`);
        console.log(`Skipped Already Cloudinary: ${counters.skipped_cloudinary}`);
        console.log(`Skipped Unknown: ${counters.skipped_unknown}`);
        console.log(`Errors: ${counters.errors}`);
        if (errorDetails.length > 0) {
            console.log('--- Error Details ---');
            console.log(errorDetails);
        }
        console.log('-------------------------');

    } catch (error) {
        console.error('❌ Critical Migration Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

migrateImages();
