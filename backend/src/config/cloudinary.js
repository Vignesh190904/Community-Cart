import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure env vars are loaded (safety check)
dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

// Runtime Validation
const missingKeys = [];
if (!CLOUDINARY_CLOUD_NAME) missingKeys.push('CLOUDINARY_CLOUD_NAME');
if (!CLOUDINARY_API_KEY) missingKeys.push('CLOUDINARY_API_KEY');
if (!CLOUDINARY_API_SECRET) missingKeys.push('CLOUDINARY_API_SECRET');

if (missingKeys.length > 0) {
  console.warn(
    `⚠️  Cloudinary Warning: Missing environment variables: ${missingKeys.join(
      ', '
    )}. Cloudinary upload features will be disabled.`
  );
} else {
    // Configure Cloudinary only if keys are present
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
    console.log('✅ Cloudinary Configured Successfully');
}

export default cloudinary;
