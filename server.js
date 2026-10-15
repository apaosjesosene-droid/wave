import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const PORT = process.env.PORT || 8080;
const app = express();
const http = createServer(app);

// Optional extra VPN exit nodes (other Wisp servers you run), e.g.
// EXIT_NODES='[{"id":"nyc","name":"New York","url":"wss://nyc.example.com/wisp/"}]'
let extra = [];
try { extra = JSON.parse(process.env.EXIT_NODES || "[]"); } catch { console.warn("EXIT_NODES is not valid JSON"); }
const nodes = [{ id: "local", name: "This server", url: null }, ...extra];

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});
app.use("/scram", express.static(scramjetPath));
app.use("/baremux", express.static(baremuxPath));
app.use("/epoxy", express.static(epoxyPath));
app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));

app.get("/api/config", (_, res) => res.json({ nodes }));
app.get("/api/health", (_, res) => res.json({ ok: true, time: Date.now() }));
app.get("/api/ip", async (_, res) => {          // public IP your traffic exits from (local node)
  try {
    const r = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(4000) });
    res.json(await r.json());
  } catch { res.status(502).json({ error: "lookup failed" }); }
});

http.on("upgrade", (req, socket, head) =>
  req.url.startsWith("/wisp/") ? wisp.routeRequest(req, socket, head) : socket.destroy());

http.listen(PORT, () => console.log(`Wave running on http://localhost:${PORT}`));
