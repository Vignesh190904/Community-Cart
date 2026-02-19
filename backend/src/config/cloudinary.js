import { v2 as cloudinary } from 'cloudinary';
import ENV from './env.js';

const { CLOUD_NAME, API_KEY, API_SECRET } = ENV.CLOUDINARY;

// Runtime Validation
const missingKeys = [];
if (!CLOUD_NAME) missingKeys.push('CLOUDINARY_CLOUD_NAME');
if (!API_KEY) missingKeys.push('CLOUDINARY_API_KEY');
if (!API_SECRET) missingKeys.push('CLOUDINARY_API_SECRET');

if (missingKeys.length > 0) {
  console.warn(
    `⚠️  Cloudinary Warning: Missing environment variables. Cloudinary upload features will be disabled.`
  );
} else {
  // Configure Cloudinary only if keys are present
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
  console.log('✅ Cloudinary Configured Successfully');
}

export default cloudinary;
