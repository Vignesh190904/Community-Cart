import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, getDbStatus } from './src/config/db.js';
import User from './models/User.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Helper to print clickable hyperlinks in supported terminals (OSC 8)
const makeLink = (url, text) => `\u001b]8;;${url}\u0007${text}\u001b]8;;\u0007`;

// Ensure models are registered (example: User)
try { import('./models/User.model.js'); } catch (_) {}

const PORT = process.env.PORT || 5000;

// Start server regardless of DB to surface health status
app.listen(PORT, () => {
	const baseUrl = `http://localhost:${PORT}`;
	const healthUrl = `${baseUrl}/health`;
	console.log(`🌐 Backend running on port ${PORT}`);
	console.log(`🔗 Health (plain): ${healthUrl}`);
	console.log(`🔗 Health (hyperlink): ${makeLink(healthUrl, 'Open /health')}`);
});

// Seed admin from .env if provided
const ensureAdminUser = async () => {
	const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
	if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
		console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env; skipping admin seed');
		return;
	}

	const existing = await User.findOne({ email: ADMIN_EMAIL });
	if (!existing) {
		const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
		await User.create({
			name: 'Admin',
			email: ADMIN_EMAIL,
			password: hashed,
			role: 'admin',
			isActive: true,
		});
		console.log('✅ Seeded admin user from .env');
		return;
	}

	if (existing.role !== 'admin') {
		existing.role = 'admin';
		await existing.save();
		console.log('ℹ️  Updated existing admin user role to admin');
	}
};

// Attempt DB connection and report status
(async () => {
	await connectDB();
	const status = getDbStatus();
	console.log(`📊 MongoDB Connection Status: ${status.connected}`);
	if (!status.connected && status.error) {
		console.log(`🔎 MongoDB Error: ${status.error}`);
		return;
	}

	try {
		await ensureAdminUser();
	} catch (err) {
		console.error('⚠️  Failed to seed admin user:', err.message);
	}
})();