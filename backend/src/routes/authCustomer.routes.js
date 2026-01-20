import express from 'express';
import {
    manualSignupStart,
    manualSignupVerifyEmail,
    resendSignupOtp,
    manualSignin,
    googleSignupStart,
    googleSignupVerifyEmail,
    googleSignin,
    logout,
    getMe
} from '../controllers/authCustomer.controller.js';

const router = express.Router();

/* MANUAL SIGNUP */
router.post('/signup/start', manualSignupStart);
router.post('/signup/verify-email', manualSignupVerifyEmail);
router.post('/signup/resend-otp', resendSignupOtp);

/* MANUAL SIGNIN */
router.post('/signin', manualSignin);

/* GOOGLE SIGNUP */
router.post('/google/signup/start', googleSignupStart);
router.post('/google/signup/verify-email', googleSignupVerifyEmail);

/* GOOGLE SIGNIN */
router.post('/google/signin', googleSignin);

/* SESSION */
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
