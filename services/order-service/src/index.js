import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

async function ensureSchema() {
  const count = await prisma.order.count();
  if (count === 0) {
    await prisma.order.createMany({
      data: [
        { status: "PENDING" },
        { status: "PAID" },
        { status: "SHIPPED" },
      ],
    });
  }
}

app.get("/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: "order-service", db: "up" });
  } catch {
    res.status(500).json({ ok: false, service: "order-service", db: "down" });
  }
});

app.get("/orders", async (_, res) => {
  const orders = await prisma.order.findMany({ orderBy: { id: "asc" } });
  res.json(orders);
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
