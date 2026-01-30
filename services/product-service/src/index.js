import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

async function ensureSchema() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: "T-shirt FastShop" },
        { name: "Mug FastShop" },
        { name: "Casquette FastShop" },
      ],
    });
  }
}

app.get("/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: "product-service", db: "up" });
  } catch {
    res.status(500).json({ ok: false, service: "product-service", db: "down" });
  }
});

app.get("/products", async (_, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.json(products);
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
