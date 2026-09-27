const CACHE='transform-shell-v2';
const SHELL=['/','/manifest.webmanifest','/icon.svg','/transform_full_logo.png','/transform-nz-mountains.jpg','/menhelpingeachother.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(SHELL.map(url=>c.add(url)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;const isNav=e.request.mode==='navigate';e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(async()=>{const cached=await caches.match(e.request);if(cached)return cached;if(isNav)return caches.match('/');return new Response('Offline',{status:503,statusText:'Offline'})}))});
