import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { fetch } from 'undici';

// Models
const vendorSchema = new mongoose.Schema({
    storeName: String, contact: { email: String }, isActive: { type: Boolean, default: true }
});
const Vendor = mongoose.model('Vendor', vendorSchema);

// Config
const MONGO_URI = process.env.MONGO_URI;
const API_URL = 'http://127.0.0.1:5000/api/vendors/orders';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

console.log('API_URL:', API_URL);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        // 1. Find or Create Test Vendor
        let vendor = await Vendor.findOne({ 'contact.email': 'v@test.com' });
        if (!vendor) {
            console.log('Creating Test Vendor...');
            vendor = await Vendor.create({ storeName: 'Test Vendor', contact: { email: 'v@test.com' }, isActive: true });
        }
        console.log('Vendor Found:', vendor._id);

        // Ensure at least one order exists for this vendor to verify the shape
        // We need the Order model here to check/create
        const orderSchema = new mongoose.Schema({
            orderNumber: String, status: String, vendorId: mongoose.Schema.Types.ObjectId,
            customer_snapshot: Object, delivery_address_snapshot: Object, items: [Object], pricing: Object, payment: Object
        }, { timestamps: true });
        // Avoid overwriting if compiled
        const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

        await Order.deleteMany({ vendorId: vendor._id }); // Clear old dummies

        console.log('Creating Dummy Order for Verification...');
        const newOrder = await Order.create({
            orderNumber: 'ORD-TEST-001',
            status: 'pending',
            vendorId: vendor._id,
            items: [{ productId: new mongoose.Types.ObjectId(), name: 'Test Item', quantity: 1, price: 100 }],
            pricing: { totalAmount: 100 },
            payment: { method: 'cod' },
            customer_snapshot: { name: 'Test User', phone: '123' },
            delivery_address_snapshot: { flat_number: '1', floor: '1', block: 'A', community: 'C' },
            createdAt: new Date() // Explicitly set to be sure
        });
        console.log('Created Order ID:', newOrder._id);

        // 2. Generate Token
        // Payload structure: { id, role }
        const token = jwt.sign({ id: vendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Token Generated for Vendor:', vendor._id);

        // 3. Call API
        console.log('Calling Get Vendor Orders...');
        const urlWithQuery = `${API_URL}?vendorId=${vendor._id}`;
        console.log('URL:', urlWithQuery);

        const res = await fetch(urlWithQuery, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const status = res.status;
        const data = await res.json();

        console.log('DEBUG_VENDOR_ID_HEADER:', res.headers.get('x-debug-vendor-id'));

        console.log(`FINAL_STATUS: ${status}`);

        if (status === 200) {
            console.log(`ORDER_COUNT: ${data.length}`);
            if (data.length > 0) {
                const firstOrder = data[0];
                const keys = Object.keys(firstOrder);
                // console.log('RESPONSE_KEYS:', keys.join(', '));

                const requiredKeys = ['order_id', 'order_number', 'status', 'created_at', 'customer', 'delivery_address_snapshot', 'items', 'total_amount', 'payment_method'];
                const missing = requiredKeys.filter(k => !keys.includes(k));

                if (missing.length === 0) {
                    console.log('CONTRACT_VERIFIED: true');
                } else {
                    console.log('CONTRACT_VERIFIED: false');
                    console.log('MISSING_KEYS:', missing.join(', '));
                }
            } else {
                console.log('NO_ORDERS_FOUND');
                console.log('DEBUG_RESPONSE:', JSON.stringify(data));
            }
        } else {
            console.log(`ERROR_MSG: ${data.error || JSON.stringify(data)}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Script Error:', err);
    }
}

run();
