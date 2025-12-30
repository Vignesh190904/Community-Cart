/**
 * Email notification utility
 * Sends emails using Gmail SMTP
 */
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (!process.env.GMAIL_APP_PASSWORD || !process.env.EMAIL_FROM) {
    console.warn('Email configuration missing. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

/**
 * Send email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email text content
 * @param {string} html - Email HTML content (optional)
 * @returns {Promise<Object>} Result object with success status
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    const mailOptions = {
      from: `Lumen Quest <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail
};
