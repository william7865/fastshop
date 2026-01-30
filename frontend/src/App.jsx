import { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/products").then(r => r.json()).then(setProducts);
    fetch("/orders").then(r => r.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h2>Produits</h2>
      <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>

      <h2>Commandes</h2>
      <ul>{orders.map(o => <li key={o.id}>{o.total}</li>)}</ul>
    </div>
  );
}
