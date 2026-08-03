/* =====================================================
   REMINDO v1.4
   Service Worker
   Never Miss What Matters.
===================================================== */


const CACHE_NAME = "remindo-v1.4";



const FILES_TO_CACHE = [

"./",

"./index.html",

"./style.css",

"./script.js",

"./manifest.json",

"./icon-512.png",

"./favicon.png"

];





// INSTALL SERVICE WORKER

self.addEventListener(

"install",

event=>{


event.waitUntil(


caches.open(CACHE_NAME)

.then(cache=>{


return cache.addAll(FILES_TO_CACHE);


})


);


self.skipWaiting();


}

);








// ACTIVATE SERVICE WORKER

self.addEventListener(

"activate",

event=>{


event.waitUntil(


caches.keys()

.then(cacheNames=>{


return Promise.all(


cacheNames.map(cache=>{


if(cache !== CACHE_NAME){


return caches.delete(cache);


}


})


);


})


);


self.clients.claim();


}

);








// FETCH FILES

self.addEventListener(

"fetch",

event=>{


event.respondWith(


caches.match(event.request)

.then(response=>{


return response || fetch(event.request);


})


);


}

);








// PUSH NOTIFICATIONS

self.addEventListener(

"push",

event=>{


let data = {

title:"Remindo Reminder",

message:"You have an upcoming reminder."

};



if(event.data){


data =
event.data.json();


}




const options = {


body:data.message,


icon:"icon-512.png",


badge:"icon-512.png",


vibrate:[

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


}

);








// NOTIFICATION CLICK

self.addEventListener(

"notificationclick",

event=>{


event.notification.close();



event.waitUntil(


clients.openWindow(

"./"

)


);


}

);
