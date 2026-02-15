import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Go up two levels from src/config to backend root
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

console.log('✅ Environment variables loaded from:', envPath);
