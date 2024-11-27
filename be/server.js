const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// https.createServer(options, app).listen(443);
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Create tables
async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(255) NOT NULL,
      image TEXT,
      created_by INTEGER REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS information (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER REFERENCES profiles(id),
      content TEXT NOT NULL,
      added_by INTEGER REFERENCES users(id),
      upvotes INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER REFERENCES profiles(id),
      rating INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
}

createTables();

// API routes

app.get("/", (req, resp) => {
  resp.send("Node API");
});

app.post("/api/users", async (req, res) => {
  const { username, phoneNumber } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, phone_number) VALUES ($1, $2) RETURNING id",
      [username, phoneNumber]
    );
    res.json({ id: result.rows[0].id, username, phoneNumber });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/profiles", async (req, res) => {
  const { name, category, image, createdBy } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO profiles (name, category, image, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, category, image, createdBy]
    );
    res.json({ id: result.rows[0].id, name, category, image, createdBy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/profiles", async (req, res) => {
  try {
    const result = await pool.query(
      // "SELECT * FROM profiles, users WHERE profiles.created_by = users.id"
      "SELECT profiles.id AS id,profiles.name,profiles.category,profiles.image,profiles.created_by,users.id AS user_id,users.username AS user_username,users.phone_number AS user_phone_number FROM profiles JOIN users ON profiles.created_by=users.id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/information", async (req, res) => {
  const { profileId, content, addedBy } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO information (profile_id, content, added_by) VALUES ($1, $2, $3) RETURNING id",
      [profileId, content, addedBy]
    );
    res.json({
      id: result.rows[0].id,
      profileId,
      content,
      addedBy,
      upvotes: 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/information/:profileId", async (req, res) => {
  const { profileId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM information WHERE profile_id = $1",
      [profileId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/information/:id/upvote", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE information SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ratings", async (req, res) => {
  const { profileId, rating, userId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ratings (profile_id, rating, user_id) VALUES ($1, $2, $3) RETURNING id",
      [profileId, rating, userId]
    );
    res.json({ id: result.rows[0].id, profileId, rating, userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
