import express from "express";
const app = express();
import { config } from "dotenv";
config();

import { createOrder, retriveOrder } from "./klarna.js";

const products = [
  { id: "1", price: 57, name: "lamp" },
  { id: "2", price: 89, name: "chair" },
  { id: "3", price: 90, name: "house" },
];

app.get("/", (req, res) => {
  res.send(
    products
      .map(
        (product) =>
          `<a href="${process.env.REDIRECT_URL}/p/${product.id}">${product.name}</a>`
      )
      .join("")
  );
});

app.get("/p/:id", async (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id === id);
  const data = await createOrder(product);
  res.send(data.html_snippet);
});

app.get("/confirmation", async (req, res) => {
  const order_id = req.query.order_id;
  const data = await retriveOrder(order_id);
  res.send(data.html_snippet);
});

app.listen(3000);
