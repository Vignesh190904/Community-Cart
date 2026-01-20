import nodemailer from 'nodemailer';

// Lazy transporter initialization to ensure env vars are loaded
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        // Validate SMTP credentials
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP credentials missing in environment variables. Please set SMTP_USER and SMTP_PASS in .env file.');
        }

        // Create transporter with explicit SMTP configuration
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || `"Community Cart" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Verification Code</h2>
      <p>Your code is: <strong style="font-size: 24px;">${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    </div>`,
    };

    await getTransporter().sendMail(mailOptions);
};
