/* =====================================================
   REMINDO v1.6
   Service Worker
   Never Miss What Matters.
===================================================== */

const CACHE_NAME = "remindo-v1.6";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-512.png",
    "./favicon.png"
];


// =====================================================
// INSTALL SERVICE WORKER
// =====================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })

    );

    self.skipWaiting();

});


// =====================================================
// ACTIVATE SERVICE WORKER
// =====================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cache => {

                        if (cache !== CACHE_NAME) {
                            return caches.delete(cache);
                        }

                    })

                );

            })

            .then(() => self.clients.claim())

    );

});


// =====================================================
// FETCH
// NETWORK FIRST
// =====================================================

self.addEventListener("fetch", event => {

    // Only handle GET requests
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then(response => {

                // Save the newest version in cache
                const responseClone = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });

                return response;

            })

            .catch(() => {

                // If offline, use cached version
                return caches.match(event.request);

            })

    );

});


// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

self.addEventListener("push", event => {

    let data = {
        title: "Remindo Reminder",
        message: "You have an upcoming reminder."
    };

    if (event.data) {

        try {
            data = event.data.json();
        } catch (error) {
            console.log("Push data error:", error);
        }

    }

    const options = {

        body: data.message,

        icon: "icon-512.png",

        badge: "icon-512.png",

        vibrate: [
            200,
            100,
            200
        ]

    };

    event.waitUntil(

        self.registration.showNotification(
            data.title,
            options
        )

    );

});


// =====================================================
// NOTIFICATION CLICK
// =====================================================

self.addEventListener("notificationclick", event => {

    event.notification.close();

    event.waitUntil(

        clients.openWindow("./")

    );

});
