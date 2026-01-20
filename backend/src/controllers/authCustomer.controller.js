import Customer from '../models/Customer.model.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import {
    generateOtp,
    storeOtp,
    verifyOtp,
    createSignupRecord,
    getSignupRecord,
    updateSignupRecord,
    deleteSignupRecord
} from '../utils/otpStore.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { signToken } from '../utils/jwt.utils.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================================
// HELPER: Create Session (REMOVED - Using JWT)
// ================================
// const createSession = (req, customer) => { ... }

// ================================
// MANUAL SIGN-UP FLOW
// ================================

// Step 1: Start signup - create temp record and send email OTP
export const manualSignupStart = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
                error_code: 'MISSING_FIELDS'
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
                error_code: 'EMAIL_EXISTS'
            });
        }

        // Create temporary signup record
        createSignupRecord(email, { name, email, password, authProvider: 'manual' });

        // Generate and send email OTP
        const otp = generateOtp();
        storeOtp(email, otp);
        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email'
        });
    } catch (error) {
        console.error('Manual Signup Start Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};

// Step 2: Verify email OTP and CREATE USER immediately
export const manualSignupVerifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
                error_code: 'MISSING_FIELDS'
            });
        }

        const isValid = verifyOtp(email, otp);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
                error_code: 'INVALID_OTP'
            });
        }

        // Get signup record
        const record = getSignupRecord(email);
        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Signup session expired. Please start again.',
                error_code: 'SESSION_EXPIRED'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(record.password, 10);

        // CREATE USER IMMEDIATELY
        const customer = await Customer.create({
            name: record.name,
            email: record.email,
            phone: null, // Phone is now optional
            auth: {
                method: 'manual',
                manual: {
                    password_hash: passwordHash
                }
            },
            verification: {
                email_verified: true,
                phone_verified: false
            },
            signup_source: 'manual',
            isActive: true
        });

        // Delete temporary signup record
        deleteSignupRecord(email);

        // Create token
        const auth_token = signToken(customer._id);

        // Set Auth Cookie
        res.cookie('auth_token', auth_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("✅ EMAIL OTP VERIFIED — USER CREATED AND AUTHENTICATED");

        return res.status(201).json({
            success: true,
            message: 'Signup successful',
            auth_token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                method: customer.auth.method,
                ui_preferences: customer.ui_preferences
            }
        });
    } catch (error) {
        console.error('Manual Signup Verify Email Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};

// Resend OTP (EMAIL ONLY)
export const resendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
                error_code: 'MISSING_FIELDS'
            });
        }

        const record = getSignupRecord(email);
        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Signup session expired. Please start again.',
                error_code: 'SESSION_EXPIRED'
            });
        }

        // Initialize count if missing
        const currentCount = record.emailResendCount || 0;

        if (currentCount >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Max resend attempts reached. Please wait or restart.',
                error_code: 'MAX_RESEND_ATTEMPTS'
            });
        }

        const otp = generateOtp();
        storeOtp(email, otp); // Overwrites old OTP
        await sendOtpEmail(email, otp);
        updateSignupRecord(email, { emailResendCount: currentCount + 1 });

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully',
            attemptsRemaining: 3 - (currentCount + 1)
        });

    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};

// ================================
// MANUAL SIGN-IN FLOW
// ================================

export const manualSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                error_code: 'MISSING_FIELDS'
            });
        }

        // Find customer
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Account not found',
                error_code: 'ACCOUNT_NOT_FOUND'
            });
        }

        // Check auth method
        if (customer.auth.method !== 'manual') {
            return res.status(400).json({
                success: false,
                message: 'Please sign in with Google',
                error_code: 'WRONG_AUTH_METHOD'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, customer.auth.manual.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                error_code: 'INVALID_CREDENTIALS'
            });
        }

        // Update last login
        customer.auth.last_login_at = new Date();
        await customer.save();

        // Create token
        const auth_token = signToken(customer._id);

        // Set Auth Cookie
        res.cookie('auth_token', auth_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            auth_token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                method: customer.auth.method,
                ui_preferences: customer.ui_preferences
            }
        });
    } catch (error) {
        console.error('Manual Signin Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};

// ================================
// GOOGLE SIGN-UP FLOW
// ================================

// Step 1: Start Google signup - verify token and send email OTP
export const googleSignupStart = async (req, res) => {
    try {
        const { googleToken } = req.body;

        if (!googleToken) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required',
                error_code: 'MISSING_TOKEN'
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub, email, name } = ticket.getPayload();

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists',
                error_code: 'ACCOUNT_ALREADY_EXISTS'
            });
        }

        // Create temporary signup record
        createSignupRecord(email, {
            name,
            email,
            googleToken,
            googleSub: sub,
            authProvider: 'google'
        });

        // Generate and send email OTP
        const otp = generateOtp();
        storeOtp(email, otp);
        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email',
            data: { email }
        });
    } catch (error) {
        console.error('Google Signup Start Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error_code: 'GOOGLE_AUTH_FAILED'
        });
    }
};

// Step 2: Verify email OTP and CREATE USER immediately
export const googleSignupVerifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
                error_code: 'MISSING_FIELDS'
            });
        }

        const isValid = verifyOtp(email, otp);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
                error_code: 'INVALID_OTP'
            });
        }

        // Get signup record
        const record = getSignupRecord(email);
        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Signup session expired. Please start again.',
                error_code: 'SESSION_EXPIRED'
            });
        }

        // CREATE USER IMMEDIATELY
        const customer = await Customer.create({
            name: record.name,
            email: record.email,
            phone: null, // Phone is now optional
            auth: {
                method: 'google',
                google: {
                    sub: record.googleSub,
                    email_verified: true
                }
            },
            verification: {
                email_verified: true,
                phone_verified: false
            },
            signup_source: 'google',
            isActive: true
        });

        // Delete temporary signup record
        deleteSignupRecord(email);

        // Create token
        const auth_token = signToken(customer._id);

        // Set Auth Cookie
        res.cookie('auth_token', auth_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("✅ EMAIL OTP VERIFIED — USER CREATED AND AUTHENTICATED");

        return res.status(201).json({
            success: true,
            message: 'Signup successful',
            auth_token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                method: customer.auth.method,
                ui_preferences: customer.ui_preferences
            }
        });
    } catch (error) {
        console.error('Google Signup Verify Email Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};



// ================================
// GOOGLE SIGN-IN FLOW
// ================================

export const googleSignin = async (req, res) => {
    try {
        const { googleToken } = req.body;

        if (!googleToken) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required',
                error_code: 'MISSING_TOKEN'
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { email } = ticket.getPayload();

        // Find customer
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Account not found',
                error_code: 'ACCOUNT_NOT_FOUND'
            });
        }

        // Check auth method
        if (customer.auth.method !== 'google') {
            return res.status(400).json({
                success: false,
                message: 'Please sign in with email and password',
                error_code: 'WRONG_AUTH_METHOD'
            });
        }

        // Update last login
        customer.auth.last_login_at = new Date();
        await customer.save();

        // Create token
        const auth_token = signToken(customer._id);

        // Set Auth Cookie
        res.cookie('auth_token', auth_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            auth_token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                method: customer.auth.method,
                ui_preferences: customer.ui_preferences
            }
        });
    } catch (error) {
        console.error('Google Signin Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error_code: 'GOOGLE_AUTH_FAILED'
        });
    }
};

// ================================
// SESSION MANAGEMENT
// ================================

export const logout = async (req, res) => {
    try {
        // Clear Auth Cookie
        res.cookie('auth_token', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
            sameSite: 'lax',
            secure: true
        });

        // Stateless logout - client discards token
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};

// Optional: Get current user from session
export const getMe = async (req, res) => {
    try {
        // User is already attached by protect middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
                error_code: 'NOT_AUTHENTICATED'
            });
        }

        const customer = req.user;

        return res.status(200).json({
            success: true,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                method: customer.auth.method,
                emailVerified: customer.verification.email_verified,
                phoneVerified: customer.verification.phone_verified,
                ui_preferences: customer.ui_preferences
            }
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_code: 'SERVER_ERROR'
        });
    }
};
