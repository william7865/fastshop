import express from "express";
import pg from "pg";

const app = express();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5435/products",
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
}

app.get("/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "product-service", db: "up" });
  } catch (err) {
    res.status(500).json({ ok: false, service: "product-service", db: "down" });
  }
});

app.get("/products", async (_, res) => {
  const { rows } = await pool.query("SELECT id, name FROM products ORDER BY id");
  res.json(rows);
});

const port = 3001;
ensureSchema()
  .then(() => {
    app.listen(port, () => console.log(`product-service on ${port}`));
  })
  .catch((err) => {
    console.error("Failed to initialize product-service", err);
    process.exit(1);
  });
