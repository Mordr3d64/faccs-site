require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // Replace mysql2 with pg
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Neon Postgres Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

// Test connection
pool.query('SELECT NOW()')
  .then(res => console.log('Neon connected! Time:', res.rows[0].now))
  .catch(err => console.error('Connection failed:', err));


const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://WebsiteData_owner:npg_vjlDyz7PWVt8@ep-steep-pond-a1qk1wij.ap-southeast-1.aws.neon.tech/WebsiteData?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection failed:', err));

// API Endpoints (Updated for Postgres)
app.get('/api/announcements', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM announcements');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).send('Error fetching announcements');
  }
});

app.post('/api/announcements', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO announcements (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding announcement:', err);
    res.status(500).send('Error adding announcement');
  }
});

app.put('/api/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  try {
    const { rowCount } = await pool.query(
      'UPDATE announcements SET title = $1, content = $2 WHERE id = $3',
      [title, content, id]
    );
    if (rowCount === 0) {
      return res.status(404).send('Announcement not found');
    }
    res.send('Announcement updated successfully');
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).send('Error updating announcement');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});