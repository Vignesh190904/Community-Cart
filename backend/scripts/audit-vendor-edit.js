
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
        const email = `audit_test_${Date.now()}@test.com`;
        const initialPassword = 'initialPassword123';
        const vendorData = {
            storeName: 'Audit Store',
            contact: { email, phone: '1234567890' },
            password: await bcrypt.hash(initialPassword, 10),
            vendorType: 'grocery'
        };

        const vendor = await Vendor.create(vendorData);
        console.log('✅ Created Test Vendor:', vendor._id);
        console.log('   Email:', vendor.contact.email);
        console.log('   Initial Password Hash:', vendor.password);

        // Verify Initial Password
        const isMatchInitial = await bcrypt.compare(initialPassword, vendor.password);
        console.log('   Initial Password Valid:', isMatchInitial);

        // 2. Simulate Admin Edit (Update ONLY email, NO password sent)
        // This mimics findByIdAndUpdate with { new: true }
        console.log('\n🔄 Simulating Admin Edit (Update Email)...');

        const updatePayload = {
            vendorType: 'bakery',
            contact: {
                email: `updated_${Date.now()}@test.com`,
                phone: '1234567890'
            }
            // NO password field in payload
        };

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendor._id,
            updatePayload,
            { new: true, runValidators: true }
        );

        console.log('✅ Vendor Updated');
        console.log('   Updated Email:', updatedVendor.contact.email);
        console.log('   Password Hash After Update:', updatedVendor.password);

        // 3. Verify Password Persisted
        const isMatchAfterUpdate = await bcrypt.compare(initialPassword, updatedVendor.password);
        console.log('   Password Still Valid:', isMatchAfterUpdate);

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
