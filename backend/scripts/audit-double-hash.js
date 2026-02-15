
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Vendor from '../src/models/Vendor.model.js';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const runAudit = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create a Test Vendor
        const email = `doublehash_${Date.now()}@test.com`;
        const initialPassword = 'password123';
        const vendorData = {
            storeName: 'Double Hash Store',
            contact: { email, phone: '1234567890' },
            password: await bcrypt.hash(initialPassword, 10),
            vendorType: 'grocery'
        };

        const vendor = await Vendor.create(vendorData);
        console.log('✅ Created Test Vendor');
        console.log('   Email:', vendor.contact.email);
        console.log('   Initial Password Hash:', vendor.password);

        // Verify Initial Password
        const isMatchInitial = await bcrypt.compare(initialPassword, vendor.password);
        console.log('   Initial Password Valid:', isMatchInitial);

        // 2. Simulate Frontend Audit (Fetch -> Send Back SAME Hash)
        // Frontend logic traces:
        // const data = await api.vendors.getById(vendorId, { includePassword: true });
        // form.password = data.password;
        // payload.password = form.password; 

        console.log('\n🔄 Simulating Admin Edit (Sending back hashed password)...');

        const retrievedHash = vendor.password;

        const updatePayload = {
            password: retrievedHash, // Sending the HASH back as if it were a new password
            vendorType: 'bakery'
        };

        // Backend Controller Logic:
        // if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);
        // await Vendor.findByIdAndUpdate(...)

        // We simulate what the controller does:
        const newHash = await bcrypt.hash(updatePayload.password, 10);

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendor._id,
            { ...updatePayload, password: newHash },
            { new: true }
        );

        console.log('✅ Vendor Updated');
        console.log('   Old Hash:', retrievedHash);
        console.log('   New Hash:', updatedVendor.password);

        // 3. Verify Login
        console.log('\n🔐 Testing Login...');
        const isMatchAfterUpdate = await bcrypt.compare(initialPassword, updatedVendor.password);
        console.log('   Login with original password:', isMatchAfterUpdate); // Expect FALSE

        const isMatchDoubleHash = await bcrypt.compare(retrievedHash, updatedVendor.password);
        console.log('   Login with OLD HASH as password:', isMatchDoubleHash); // Expect TRUE

        // 4. Clean up
        await Vendor.findByIdAndDelete(vendor._id);
        console.log('\n🧹 Test Vendor Deleted');

        process.exit(0);
    } catch (error) {
        console.error('❌ Audit Failed:', error);
        process.exit(1);
    }
};

runAudit();
