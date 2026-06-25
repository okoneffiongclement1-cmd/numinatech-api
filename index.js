require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const app = express();

// Initialize the database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

/**
 * Setup the database table if it doesn't exist.
 * This runs automatically when the server starts.
 */
const setupDatabase = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(255)
    );
  `;
  try {
    await pool.query(query);
    console.log("Database connection successful. Table 'employees' is ready.");
  } catch (err) {
    console.error("Error setting up table:", err);
  }
};

/**
 * Route: GET /employees
 * Fetches all employees from the database.
 */
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Route: GET /seed
 * Temporary helper route to add test data to your database.
 */
app.get('/seed', async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO employees (name, email, role) 
      VALUES ('Gemini Tester', 'test@numinatech.com', 'Admin')
    `);
    res.send('Database seeded! Now go back to /employees');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run database setup then start the server
setupDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
});