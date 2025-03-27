const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Allegro-is-23',
  database: 'test'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

app.put('/api/announcements/:id', (req, res) => {
  const { id } = req.params; // Get the announcement ID from the URL
  const { title, content } = req.body; // Get the updated title and content from the request body

  // Validate input
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  // Update the announcement in the database
  const query = 'UPDATE announcements SET title = ?, content = ? WHERE id = ?';
  connection.query(query, [title, content, id], (err, results) => {
    if (err) {
      console.error('Error updating announcement:', err);
      return res.status(500).send('Error updating announcement');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Announcement not found');
    }

    res.send('Announcement updated successfully');
  });
});



// API Endpoint to Fetch Announcements
app.get('/api/announcements', (req, res) => {
  const query = 'SELECT * FROM announcements';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching announcements:', err);
      res.status(500).send('Error fetching announcements');
      return;
    }
    res.json(results);
  });
});

app.post('/api/announcements', (req, res) => {
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  // Insert the new announcement into the database
  const query = 'INSERT INTO announcements (title, content) VALUES (?, ?)';
  connection.query(query, [title, content], (err, results) => {
    if (err) {
      console.error('Error adding announcement:', err);
      return res.status(500).send('Error adding announcement');
    }

    // Return the newly created announcement with its ID
    const newAnnouncement = { id: results.insertId, title, content };
    res.status(201).json(newAnnouncement);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});