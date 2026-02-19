import ENV from './src/config/env.js';
import app from './app.js';
import { connectDB, getDbStatus } from './src/config/db.js';
import Customer from './src/models/Customer.model.js'; // Ensure correct path
import bcrypt from 'bcryptjs';

// Critical Environment Validation
const requiredChecks = [
    { key: 'MONGO_URI', value: ENV.MONGO_URI },
    { key: 'JWT_SECRET', value: ENV.JWT.SECRET },
    { key: 'FRONTEND_URL', value: ENV.FRONTEND_URL }
];

const missing = requiredChecks.filter(c => !c.value).map(c => c.key);

if (missing.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const PORT = ENV.PORT;

const start_server = async () => {
    try {
        console.log('🔄 Starting server...');
        await connectDB();
        console.log(`📊 MongoDB Connected: ${getDbStatus().connected}`);

        console.log('🔄 Starting Express server...');
        app.listen(PORT, () => {
            console.log(`🌐 Backend running on port ${PORT}`);
            console.log(`🚀 Ready for Frontend at ${ENV.FRONTEND_URL}`);
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

console.log('🔄 Calling start_server...');
start_server();