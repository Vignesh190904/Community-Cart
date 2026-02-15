import './src/config/initEnv.js';
import app from './app.js';
import { connectDB, getDbStatus } from './src/config/db.js';
import Customer from './src/models/Customer.model.js'; // Ensure correct path
import bcrypt from 'bcryptjs';

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL', 'PORT'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const PORT = process.env.PORT || 5000;

const start_server = async () => {
    try {
        console.log('🔄 Starting server...');
        await connectDB();
        console.log(`📊 MongoDB Connected: ${getDbStatus().connected}`);

        console.log('🔄 Starting Express server...');
        app.listen(PORT, () => {
            console.log(`🌐 Backend running on port ${PORT}`);
            console.log(`🚀 Ready for Frontend at ${process.env.CLIENT_URL}`);
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

console.log('🔄 Calling start_server...');
start_server();