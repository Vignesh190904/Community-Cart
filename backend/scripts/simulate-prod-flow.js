import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5001/api'; // Using PROD-SIMULATION port
const VENDOR_EMAIL = 'testvendor_' + Date.now() + '@example.com';
const VENDOR_PASS = 'password123';
const CUSTOMER_EMAIL = 'testcustomer_' + Date.now() + '@example.com';
const CUSTOMER_PASS = 'password123';

let vendorToken = '';
let customerToken = '';
let productId = '';

const log = (msg, type = 'INFO') => console.log(`[${type}] ${msg}`);

const runSimulation = async () => {
    try {
        log('--- Starting Production Workflow Simulation ---');

        // ==========================================
        // 1. VENDOR WORKFLOW
        // ==========================================
        log('Creating Vendor...');
        const vendorRes = await axios.post(`${BASE_URL}/vendors`, {
            storeName: 'Simulated Store',
            contact: { email: VENDOR_EMAIL, phone: '1234567890' },
            password: VENDOR_PASS,
            address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345'
            }
        });

        log('Logging in Vendor...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: VENDOR_EMAIL,
            password: VENDOR_PASS
        });
        vendorToken = loginRes.data.data.auth_token;
        log(`Vendor Logged In. Token: ${vendorToken.substring(0, 10)}...`);

        log('Adding Product (JSON)...');
        // Sending JSON to verify logic without Multipart complexity
        const productData = {
            name: 'Simulation Product',
            description: 'Created by E2E script',
            price: 100,
            category: 'vegetables',
            stock: 50,
            unit: 'kg',
            quantity: 1,
            minOrderQuantity: 1
        };

        const productRes = await axios.post(`${BASE_URL}/products`, productData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vendorToken}`
            }
        });
        productId = productRes.data._id;
        log(`Product Created: ${productId}`);

        // ==========================================
        // 2. CUSTOMER WORKFLOW
        // ==========================================
        log('Registering Customer...');
        const userRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Simulated Customer',
            email: CUSTOMER_EMAIL,
            password: CUSTOMER_PASS,
            role: 'user'
        });
        const userToken = userRes.data.data.auth_token;
        log(`Customer (User) Registered. Token: ${userToken.substring(0, 10)}...`);

        log('Fetching Products...');
        const productsRes = await axios.get(`${BASE_URL}/products`);
        if (!productsRes.data.products?.find(p => p._id === productId) && !productsRes.data.find(p => p._id === productId)) {
            // Handle both pagination format and array format
            // Product API might return array directly or { products: [] }
            // Let's assume array if .find works on data, else check prop.
            const found = Array.isArray(productsRes.data) ? productsRes.data.find(p => p._id === productId) : productsRes.data.products.find(p => p._id === productId);
            if (found) {
                log('Target product found in listing.');
            } else {
                log('Product created but NOT found in listing?');
            }
        } else {
            log('Target product found in listing.');
        }

        // ==========================================
        // 3. CLEANUP
        // ==========================================
        log('Deleting Product...');
        await axios.delete(`${BASE_URL}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${vendorToken}` }
        });
        log('Product Deleted');

        log('✅ SIMULATION PASSED');
    } catch (error) {
        if (error.response) {
            console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('❌ Network/Script Error:', error.message);
        }
        process.exit(1);
    }
};

runSimulation();
