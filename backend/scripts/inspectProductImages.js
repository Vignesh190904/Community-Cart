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

const inspectImages = async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        // Fetch more products to get a better sample
        const products = await Product.find({}).limit(20);
        console.log(`🔍 Inspecting ${products.length} products...\n`);

        products.forEach((product) => {
            const image = product.image || '';
            const startsWithHttp = image.startsWith('http');
            const containsCloudinary = image.includes('res.cloudinary.com');
            const isBase64 = image.startsWith('data:image');

            let displayValue = image;
            if (image.length > 50) {
                displayValue = image.substring(0, 50) + '... [TRUNCATED]';
            }

            console.log(`Product: ${product.name} (ID: ${product._id})`);
            console.log(`Image (First 50 chars): ${displayValue}`);
            console.log(`Length: ${image.length}`);
            console.log(`Type: ${typeof image}`);
            console.log(`StartsWithHttp: ${startsWithHttp}`);
            console.log(`IsBase64: ${isBase64}`);
            console.log('-------------------------');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

inspectImages();
