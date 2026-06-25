const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Database configuration (Railway provides these via environment variables)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET: Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new employee
app.post('/employees', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const query = 'INSERT INTO employees (name, email, role) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, role];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});