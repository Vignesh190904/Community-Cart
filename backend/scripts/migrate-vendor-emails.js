
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Vendor from '../src/models/Vendor.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const vendors = await Vendor.find({});
        console.log(`🔍 Found ${vendors.length} vendors.`);

        let updatedCount = 0;
        for (const vendor of vendors) {
            if (vendor.contact && vendor.contact.email) {
                const originalEmail = vendor.contact.email;
                const normalizedEmail = originalEmail.trim().toLowerCase();

                if (originalEmail !== normalizedEmail) {
                    console.log(`✏️ Updating: ${originalEmail} -> ${normalizedEmail}`);
                    vendor.contact.email = normalizedEmail;
                    await vendor.save();
                    updatedCount++;
                }
            }
        }

        console.log(`✅ Migration complete. Updated ${updatedCount} vendors.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
