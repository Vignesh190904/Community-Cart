// In-memory stores (will be lost on server restart)
const otpStore = new Map(); // key: identifier (email), value: { otp, expires }
const signupStore = new Map(); // key: email, value: { name, email, password, emailVerified, googleToken, authProvider }

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtp = (identifier, otp) => {
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(identifier, { otp, expires });
    // console.log(`[MOCK OTP] Identifier: ${identifier}, OTP: ${otp}`);
};

export const verifyOtp = (identifier, inputOtp) => {
    const record = otpStore.get(identifier);
    if (!record) return false;
    if (Date.now() > record.expires) {
        otpStore.delete(identifier);
        return false;
    }
    if (record.otp === inputOtp) {
        otpStore.delete(identifier); // One-time use
        return true;
    }
    return false;
};

// Temporary signup record management
export const createSignupRecord = (email, data) => {
    signupStore.set(email, {
        ...data,
        emailVerified: false,
        createdAt: Date.now()
    });
};

export const getSignupRecord = (email) => {
    const record = signupStore.get(email);
    if (!record) return null;

    // Auto-expire after 30 minutes
    if (Date.now() - record.createdAt > 30 * 60 * 1000) {
        signupStore.delete(email);
        return null;
    }

    return record;
};

export const updateSignupRecord = (email, updates) => {
    const record = signupStore.get(email);
    if (!record) return false;

    signupStore.set(email, { ...record, ...updates });
    return true;
};

export const deleteSignupRecord = (email) => {
    signupStore.delete(email);
};
