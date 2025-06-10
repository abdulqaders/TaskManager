const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// REPLACE WITH YOUR POSTGRES CREDS IN .env
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres',  // Docker service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
});

// Create table
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
  )
`);

// Routes
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(result.rows[0]);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));