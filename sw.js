const CACHE = "lifts-v7";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    // App page: try network for updates, fall back to the saved copy offline
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // Everything else (icons, fonts): saved copy first, then network
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res;
  })));
});

// Workout notification buttons ("Set done", "Pause", "Resume") and taps on the notification itself
self.addEventListener("notificationclick", e => {
  const act = e.action || "open";
  if (act === "open") e.notification.close();
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const c = cs[0];
    // App fully closed: open it and pass the action in the address
    if (!c) { await self.clients.openWindow("./?na=" + act); return; }
    // App open in the background: send the action and wait briefly for the page to confirm
    const ok = await new Promise(res => {
      const ch = new MessageChannel();
      const t = setTimeout(() => res(false), 1500);
      ch.port1.onmessage = () => { clearTimeout(t); res(true); };
      c.postMessage({ type: "notif", act }, [ch.port2]);
    });
    // No answer means Android froze the page; bringing it forward wakes it and the queued message runs
    if (act === "open" || !ok) { try { await c.focus(); } catch (err) {} }
  })());
});
