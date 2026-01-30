import { useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("");

  async function ping() {
    const r = await fetch("http://localhost:3000/health");
    const j = await r.json();
    setMsg(JSON.stringify(j));
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>FastShop Frontend </h1>
      <button onClick={ping}>Ping API Gateway</button>
      <pre>{msg}</pre>
    </div>
  );
}
