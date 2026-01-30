import express from "express";
import pg from "pg";

const app = express();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5434/orders",
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      status TEXT NOT NULL
    )
  `);
}

app.get("/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "order-service", db: "up" });
  } catch (err) {
    res.status(500).json({ ok: false, service: "order-service", db: "down" });
  }
});

app.get("/orders", async (_, res) => {
  const { rows } = await pool.query("SELECT id, status FROM orders ORDER BY id");
  res.json(rows);
});

const port = 3002;
ensureSchema()
  .then(() => {
    app.listen(port, () => console.log(`order-service on ${port}`));
  })
  .catch((err) => {
    console.error("Failed to initialize order-service", err);
    process.exit(1);
  });
