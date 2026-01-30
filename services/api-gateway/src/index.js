import express from "express";
import fetch from "node-fetch";

const app = express();

const productServiceUrl = process.env.PRODUCT_SERVICE_URL || "http://product-service:3001";
const orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://order-service:3002";

app.get("/health", (_, res) => res.json({ ok: true, service: "api-gateway" }));

app.get("/products", async (_, res) => {
  try {
    const response = await fetch(`${productServiceUrl}/products`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: "product-service unavailable" });
  }
});

app.get("/orders", async (_, res) => {
  try {
    const response = await fetch(`${orderServiceUrl}/orders`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: "order-service unavailable" });
  }
});

app.listen(3000, () => console.log("api-gateway on 3000"));
