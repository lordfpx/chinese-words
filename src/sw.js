// Écoute de l'événement 'install'
self.addEventListener("install", function (event) {
	console.log("Service Worker installé.");

	// Ajout de fichiers statiques au cache
	event.waitUntil(
		caches.open("offline-cache").then(function (cache) {
			return cache.addAll([
				"/",
				"index.html",
				"index-08a9a383.js",
				"index-384eebf8.css",
			]);
		})
	);
});

// Écoute de l'événement 'fetch'
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			// Retourne la réponse du cache si elle existe, sinon effectue une requête réseau
			return response || fetch(event.request);
		})
	);
});
