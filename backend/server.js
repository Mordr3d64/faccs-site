require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: '*',  // More permissive for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Temporary OTP store (use a real database in production)
let otpStore = {}; // This will store OTPs temporarily

// Test endpoint to confirm server is up
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Route: Forgot Password - Generate OTP and Send Email
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP temporarily (implement expiration in production)
  otpStore[email] = otp;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Use your email in .env
        pass: process.env.EMAIL_PASS,  // Use your email password in .env
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    });

    res.status(200).send('OTP sent successfully.');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP.');
  }
});

// API Route: Reset Password - Verify OTP and Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;

  // Validate OTP
  if (otpStore[email] !== otp) {
    return res.status(400).send('Invalid OTP.');
  }

  // Here, you would hash and update the password in your database (if you had one)
  // Example: hashPassword(password);

  // Clear OTP after successful reset
  delete otpStore[email];

  res.status(200).send('Password reset successful.');
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
