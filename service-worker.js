/* =====================================================
   REMINDO v1.3
   Service Worker
===================================================== */


const CACHE_NAME = "remindo-v1";


const FILES_TO_CACHE = [

"./",

"./index.html",

"./style.css",

"./script.js",

"./manifest.json",

"./icon-512.png",

"./favicon.png"

];




// INSTALL

self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(
FILES_TO_CACHE
);

})

);


});







// ACTIVATE

self.addEventListener(
"activate",
event=>{


event.waitUntil(

caches.keys()

.then(keys=>{


return Promise.all(

keys.map(key=>{


if(key !== CACHE_NAME){

return caches.delete(key);

}


})

);


})

);


});







// FETCH

self.addEventListener(
"fetch",
event=>{


event.respondWith(


caches.match(event.request)

.then(response=>{


return response ||

fetch(event.request);


})


);


});
