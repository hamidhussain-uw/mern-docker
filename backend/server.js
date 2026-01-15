const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'mern_user',
  password: process.env.DB_PASSWORD || 'mern_password',
  database: process.env.DB_NAME || 'mern_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );

    const [newUser] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newUser[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const userId = req.params.id;

    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const [updatedUser] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    res.json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, user_id } = req.body;
    
    if (!title || !content || !user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, content, and user_id are required' 
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, user_id]
    );

    const [newPost] = await pool.execute(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json({ success: true, data: newPost[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
