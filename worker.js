let files = [
    "./index.html",
    "./style.css",
    "./script.js",
    "./helpers.js",
    "./clases.js",
    "./assets/programming.ico",
    "./manifest.json"
];
let cacheName = "V1";

self.addEventListener("install", async e=>{
    console.log("Service Worker instalado");
    try {
        let cache = await caches.open(cacheName);
        if(cache) cache.addAll(files);
        console.log("cacheada version", cacheName);
    } catch (err) {
        console.log("Error al cachear", err);
    }
})

self.addEventListener("fetch", e=>{
    e.respondWith(
        caches.match(e.request).then(archivo=>{
            if(archivo) return archivo;
            return fetch(e.request);
        })
    )
})
