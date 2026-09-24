#!/usr/bin/env node
import { spawn } from 'child_process';

const PORT = process.env.PORT || 8000;

console.log(`
================================================================
🚀 Orbit Frappe Backend Tunnel Launcher
================================================================
Connecting your local Frappe Backend (port ${PORT}) to the public internet...

OPTIONS TO TUNNEL:
1. Cloudflare Tunnel (Recommended, fastest & free):
   Run in your terminal:
   $ npx -y untun@latest tunnel http://localhost:${PORT}
   OR
   $ brew install cloudflared && cloudflared tunnel --url http://localhost:${PORT}

2. Localtunnel (Zero-install, instant):
   Run in your terminal:
   $ npx -y localtunnel --port ${PORT}

3. Ngrok:
   Run in your terminal:
   $ ngrok http ${PORT}
================================================================
👉 ONCE YOU GET YOUR HTTPS URL:
In Vercel Project Dashboard:
  Project Settings -> Environment Variables -> Add:
  Key:   VITE_BACKEND_URL
  Value: <your-tunnel-https-url> (e.g. https://xxxx.trycloudflare.com)

Then click Redeploy on Vercel!
================================================================
`);

// Auto-launch localtunnel
console.log(`Attempting auto-tunnel with localtunnel...`);
const lt = spawn('npx', ['-y', 'localtunnel', '--port', String(PORT)], { stdio: 'inherit' });

lt.on('error', (err) => {
  console.log(`Auto-tunnel process notice:`, err.message);
});
