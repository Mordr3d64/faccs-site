require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

// API Endpoints
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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email); // Debug log

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('Database query results:', rows); // Debug log

    if (rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match result:', passwordMatch); // Debug log

    if (!passwordMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const { password_hash, ...userData } = user;
    console.log('Successful login for:', email);
    res.json({ 
      success: true,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, status FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validate input
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
       RETURNING id, title, content, created_at`, // Only return existing columns
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