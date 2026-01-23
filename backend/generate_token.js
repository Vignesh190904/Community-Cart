import { signToken } from './src/utils/jwt.utils.js';
import Vendor from './src/models/Vendor.model.js';
import dotenv from 'dotenv';
dotenv.config();

const testVendor = {
    _id: '69440dabd39acfb6ef8909e5',
    role: 'vendor'
};

console.log("Generating fresh token...");
const freshToken = signToken(testVendor);
console.log("Fresh token:", freshToken);
console.log("\nTest this token with:");
console.log(`Invoke-WebRequest -Uri "http://localhost:5000/api/vendors/orders" -Method GET -Headers @{"Authorization"="Bearer ${freshToken}"}`);
