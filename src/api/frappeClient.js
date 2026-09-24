// Orbit Frappe API & WebSocket Client
// Supports localhost:8000, Cloudflare Tunnels (https/wss), and Vercel remote endpoints

export const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
};

export const getWsUrl = () => {
  const httpUrl = getBackendUrl();
  if (httpUrl.startsWith('https://')) {
    return httpUrl.replace('https://', 'wss://');
  }
  return httpUrl.replace('http://', 'ws://');
};

export const fetchDocType = async (doctype) => {
  const res = await fetch(`${getBackendUrl()}/api/resource/${encodeURIComponent(doctype)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${doctype}: ${res.statusText}`);
  const json = await res.json();
  return json.data;
};

export const fetchDoc = async (doctype, id) => {
  const res = await fetch(`${getBackendUrl()}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${doctype}/${id}: ${res.statusText}`);
  const json = await res.json();
  return json.data;
};

export const updateDoc = async (doctype, id, updates) => {
  const res = await fetch(`${getBackendUrl()}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error(`Failed to update ${doctype}/${id}: ${res.statusText}`);
  return await res.json();
};

export const callFrappeMethod = async (methodName, body = {}) => {
  const res = await fetch(`${getBackendUrl()}/api/method/${methodName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Frappe method ${methodName} error: ${res.statusText}`);
  return await res.json();
};

export const initWebSocket = (onMessage, onStatusChange) => {
  const wsUrl = getWsUrl();
  let ws = null;
  let reconnectTimer = null;

  const connect = () => {
    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[Orbit WebSocket] Connected to Frappe Realtime Engine at', wsUrl);
        if (onStatusChange) onStatusChange('connected');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (onMessage) onMessage(payload);
        } catch (err) {
          console.error('[Orbit WebSocket] Message parse error:', err);
        }
      };

      ws.onclose = () => {
        console.warn('[Orbit WebSocket] Disconnected from Frappe server. Reconnecting in 3s...');
        if (onStatusChange) onStatusChange('disconnected');
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('[Orbit WebSocket] Error:', err);
        ws.close();
      };
    } catch (e) {
      console.warn('[Orbit WebSocket] Failed to connect, retrying...', e);
      reconnectTimer = setTimeout(connect, 3000);
    }
  };

  connect();

  return () => {
    clearTimeout(reconnectTimer);
    if (ws) ws.close();
  };
};
