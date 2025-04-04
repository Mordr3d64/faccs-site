require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const emailjs = require('emailjs-com');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// In-memory storage for OTPs (used only for the current server runtime)
const otpStore = {};

// Enhanced CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Forgot Password - Generate and send OTP
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Generate OTP (One-Time Password)
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    
    // Store OTP in memory with expiration time (e.g., 15 minutes)
    otpStore[email] = { otp, expiresAt: Date.now() + 15 * 60 * 1000 }; // 15 minutes expiration time
    
    // Send OTP via email
    const templateParams = {
      email_to: email,
      subject: 'Password Reset Request',
      message: `Your OTP for password reset is: ${otp}`,
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID'
    );

    if (response.status === 200) {
      return res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } else {
      return res.status(500).json({ error: 'Error sending OTP' });
    }
  } catch (err) {
    console.error('Error in forgot password route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP and Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  try {
    // Check if the OTP exists and is still valid
    if (!otpStore[email]) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    const storedOtp = otpStore[email];
    const currentTime = Date.now();
    
    // Check OTP expiration
    if (currentTime > storedOtp.expiresAt) {
      delete otpStore[email]; // Remove expired OTP
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check if OTP matches
    if (otp !== storedOtp.otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // For simplicity, assume the email belongs to a single admin
    // Ideally, update the password in your system, e.g., in a database
    console.log(`Password for ${email} updated to: ${hashedPassword}`);

    // Optionally, delete the OTP record after successful reset
    delete otpStore[email];

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error in reset password route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
