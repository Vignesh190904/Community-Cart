
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Vendor from '../src/models/Vendor.model.js';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create Verified Vendor
        const email = `verify_${Date.now()}@test.com`;
        const pass1 = 'pass1';
        const pass2 = 'pass2';

        const vendorData = {
            storeName: 'Verify Store',
            contact: { email, phone: '1234567890' },
            password: await bcrypt.hash(pass1, 10),
            vendorType: 'grocery',
            isActive: true
        };

        const vendor = await Vendor.create(vendorData);
        console.log(`\n1️⃣ Created Vendor: ${email} (Password: ${pass1})`);

        // 2. Initial Login Check
        let isMatch = await bcrypt.compare(pass1, vendor.password);
        console.log(`   Login with '${pass1}': ${isMatch ? '✅ Success' : '❌ Failed'}`);
        if (!isMatch) throw new Error('Initial login failed');

        // 3. Simulate Frontend Update (NO Password sent)
        // mimics: delete req.body.password in controller
        console.log('\n2️⃣ Simulating Update WITHOUT Password...');

        // Controller Logic Simulation:
        const updatePayload1 = {
            storeName: 'Updated Store Name',
            // password field missing or empty
        };

        // This is exactly what the controller does:
        if (!updatePayload1.password) {
            delete updatePayload1.password;
        }

        const updatedVendor1 = await Vendor.findByIdAndUpdate(
            vendor._id,
            updatePayload1,
            { new: true }
        );

        isMatch = await bcrypt.compare(pass1, updatedVendor1.password);
        console.log(`   Login with '${pass1}' after update: ${isMatch ? '✅ Success' : '❌ Failed (Regression!)'}`);
        if (!isMatch) throw new Error('Password corrupted after update!');

        // 4. Simulate Frontend Update (WITH New Password)
        console.log(`\n3️⃣ Simulating Update WITH New Password ('${pass2}')...`);

        const updatePayload2 = {
            password: pass2
        };

        // Controller Logic Simulation:
        if (updatePayload2.password && updatePayload2.password.trim() !== '') {
            updatePayload2.password = await bcrypt.hash(updatePayload2.password, 10);
        }

        const updatedVendor2 = await Vendor.findByIdAndUpdate(
            vendor._id,
            updatePayload2,
            { new: true }
        );

        isMatch = await bcrypt.compare(pass2, updatedVendor2.password);
        console.log(`   Login with '${pass2}': ${isMatch ? '✅ Success' : '❌ Failed'}`);
        if (!isMatch) throw new Error('New password failed to save!');

        const isOldMatch = await bcrypt.compare(pass1, updatedVendor2.password);
        console.log(`   Login with '${pass1}': ${!isOldMatch ? '✅ Failed' : '❌ Success (Security Risk!)'}`);
        if (isOldMatch) throw new Error('Old password still works!');

        // Cleanup
        await Vendor.findByIdAndDelete(vendor._id);
        console.log('\n✅ Verification Complete. Test Vendor Deleted.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
        process.exit(1);
    }
};

runVerification();
