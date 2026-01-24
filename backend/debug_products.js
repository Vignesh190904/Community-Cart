
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import Product from './src/models/Product.model.js';
import Vendor from './src/models/Vendor.model.js';

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const products = await Product.find().populate('vendor', 'storeName email');
        console.log(`Found ${products.length} products total.`);

        products.forEach(p => {
            const vId = p.vendor ? p.vendor._id : 'null';
            const vName = p.vendor ? p.vendor.storeName : 'Unknown';
            console.log(`Product: ${p.name} | Vendor: ${vName} (${vId})`);
        });

        const vendors = await Vendor.find();
        console.log(`Found ${vendors.length} vendors.`);
        vendors.forEach(v => {
            console.log(`Vendor: ${v.storeName} (${v._id})`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
