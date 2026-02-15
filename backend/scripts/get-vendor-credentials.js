
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Vendor from '../src/models/Vendor.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const getVendor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const vendor = await Vendor.findOne({});
        if (vendor) {
            console.log(`VENDOR_EMAIL=${vendor.contact.email}`);
        } else {
            console.log('NO_VENDOR_FOUND');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getVendor();
