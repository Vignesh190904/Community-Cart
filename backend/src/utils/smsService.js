
// SMS service is no longer used for authentication
// Kept for backward compatibility only
export const sendOtpSms = async (mobile, otp) => {
    console.warn('[DEPRECATED] SMS service is no longer used for authentication');
    // console.log(`[MOCK SMS] Would have sent OTP ${otp} to ${mobile}`);
    return Promise.resolve();
};
