require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Database connection with pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test connection
pool.query('SELECT NOW()')
  .then(res => console.log('Neon connected! Time:', res.rows[0].now))
  .catch(err => console.error('Connection failed:', err));

// API Endpoints for Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/announcements', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO announcements (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding announcement:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: 'Validation failed',
      details: 'Both title and content are required'
    });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE announcements
       SET title = $1, content = $2
       WHERE id = $3
       RETURNING id, title, content, created_at`,
      [title, content, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        details: 'No announcement found with that ID'
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Database operation failed',
      details: err.message
    });
  }
});

app.delete('/api/announcements/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM announcements WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        error: 'Not found',
        details: 'No announcement found with that ID'
      });
    }

    res.status(204).end(); // 204 No Content for successful deletes
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      error: 'Database operation failed',
      details: err.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// New Routes for OTP-based Password Reset

let otpStore = {}; // Temporarily store OTPs (use database in production)

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

app.post('/api/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;

  if (otpStore[email] !== otp) {
    return res.status(400).send('Invalid OTP.');
  }

  // Here, you'd hash and update the password in your database
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
    pool.end();
    console.log('Server closed');
    process.exit(0);
  });
});
