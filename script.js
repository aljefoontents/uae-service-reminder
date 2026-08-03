/* =====================================================
   REMINDO v1.5
   Smart Reminder Engine
   Never Miss What Matters.
===================================================== */


let reminders =
JSON.parse(localStorage.getItem("reminders")) || [];


let editingId = null;

let searchText = "";

let currentFilter = "all";

let currentSort = "nearest";




// ELEMENTS

const addBtn = document.getElementById("addReminderBtn");

const modal = document.getElementById("modal");

const cancelBtn = document.getElementById("cancelReminder");

const saveBtn = document.getElementById("saveReminder");


const reminderContainer =
document.getElementById("reminderContainer");


const searchInput =
document.getElementById("searchInput");


const filterSelect =
document.getElementById("filterSelect");


const sortSelect =
document.getElementById("sortSelect");





// OPEN ADD REMINDER

addBtn.addEventListener("click",()=>{


editingId = null;


clearForm();


modal.classList.remove("hidden");


});






// CLOSE MODAL

cancelBtn.addEventListener("click",()=>{


modal.classList.add("hidden");


});







// SAVE REMINDER

saveBtn.addEventListener("click",()=>{


const category =
document.getElementById("category").value;



const title =
document.getElementById("title").value.trim();



const dueDate =
document.getElementById("dueDate").value;



const notes =
document.getElementById("notes").value.trim();





const alertTime =
document.getElementById("alertTime")
?
document.getElementById("alertTime").value
:
"0";




const repeat =
document.getElementById("repeat")
?
document.getElementById("repeat").value
:
"none";







if(title === "" || dueDate === ""){


alert("Please enter title and due date");


return;


}








if(editingId){



reminders =
reminders.map(item=>{


if(item.id === editingId){


return {


...item,


category,

title,

dueDate,

notes,

alertTime,

repeat


};


}



return item;



});



}

else{



reminders.push({


id:Date.now(),


category,


title,


dueDate,


notes,


alertTime,


repeat,


created:new Date().toISOString()



});



}







saveData();



displayReminders();



updateDashboard();



clearForm();



modal.classList.add("hidden");



editingId=null;



});








// SAVE TO STORAGE

function saveData(){


localStorage.setItem(

"reminders",

JSON.stringify(reminders)

);


}








// DISPLAY REMINDERS

function displayReminders(){


reminderContainer.innerHTML="";



let filtered =
reminders.filter(reminder=>{


const days =
calculateDays(reminder.dueDate);



let searchMatch =


reminder.title
.toLowerCase()
.includes(searchText)


||


reminder.category
.toLowerCase()
.includes(searchText)


||


reminder.notes
.toLowerCase()
.includes(searchText);




let filterMatch=true;



if(currentFilter==="expired"){


filterMatch =
days.expired;


}



else if(currentFilter==="urgent"){


filterMatch =
!days.expired &&
days.number <= 7;


}




else if(currentFilter==="upcoming"){


filterMatch =
!days.expired &&
days.number > 7;


}




return searchMatch && filterMatch;



});








// SORTING

filtered.sort((a,b)=>{


if(currentSort==="nearest"){


return new Date(a.dueDate)
-
new Date(b.dueDate);


}



if(currentSort==="furthest"){


return new Date(b.dueDate)
-
new Date(a.dueDate);


}



if(currentSort==="az"){


return a.title.localeCompare(b.title);


}



if(currentSort==="newest"){


return b.id-a.id;


}



});








if(filtered.length===0){



reminderContainer.innerHTML=`

<div class="empty-state">

<h2>No Reminders Found</h2>

<p>Add a reminder to get started.</p>

</div>

`;



return;



}







filtered.forEach(reminder=>{


const days =
calculateDays(reminder.dueDate);



let status="safe";



if(days.expired){


status="expired";


}

else if(days.number<=7){


status="urgent";


}

else if(days.number<=30){


status="warning";


}






const card =
document.createElement("div");



card.className =
"reminder-card "+status;





card.innerHTML = `


<div class="card-header">


<span class="category-icon">

${getCategoryIcon(reminder.category)}

</span>



<span class="category">

${reminder.category}

</span>



</div>



<h2>

${reminder.title}

</h2>




<p>

<strong>📅 Due:</strong>

${formatDate(reminder.dueDate)}

</p>




<h3>

${days.text}

</h3>




${
reminder.notes

?

`<p>${reminder.notes}</p>`

:

""

}





<button onclick="editReminder(${reminder.id})">

Edit

</button>



<button onclick="deleteReminder(${reminder.id})">

Delete

</button>



`;





reminderContainer.appendChild(card);



});



}

// =====================================================
// EDIT REMINDER
// =====================================================


function editReminder(id){


const reminder =
reminders.find(item=>item.id===id);



if(!reminder) return;



document.getElementById("category").value =
reminder.category;



document.getElementById("title").value =
reminder.title;



document.getElementById("dueDate").value =
reminder.dueDate;



document.getElementById("notes").value =
reminder.notes;




if(document.getElementById("alertTime")){


document.getElementById("alertTime").value =
reminder.alertTime || "0";


}



if(document.getElementById("repeat")){


document.getElementById("repeat").value =
reminder.repeat || "none";


}




editingId=id;



modal.classList.remove("hidden");



}









// =====================================================
// DELETE REMINDER
// =====================================================


function deleteReminder(id){


if(confirm("Delete this reminder?")){


reminders =

reminders.filter(item=>item.id!==id);



saveData();



displayReminders();



updateDashboard();



}


}










// =====================================================
// DATE CALCULATION
// =====================================================


function calculateDays(date){



const today =
new Date();



today.setHours(0,0,0,0);




const expiry =
new Date(date);



expiry.setHours(0,0,0,0);




const difference =
expiry - today;




const days =
Math.ceil(

difference /

(1000*60*60*24)

);






if(days < 0){


return {


number:Math.abs(days),


expired:true,


text:

"Expired "

+

Math.abs(days)

+

" days ago"


};


}






if(days===0){


return {


number:0,


expired:false,


text:"Expires Today"


};


}







return {


number:days,


expired:false,


text:

days

+

" Days Remaining"


};



}










// =====================================================
// FORMAT DATE
// =====================================================


function formatDate(date){



return new Date(date).toLocaleDateString(

"en-GB",

{


day:"2-digit",


month:"long",


year:"numeric"



}


);



}









// =====================================================
// DASHBOARD
// =====================================================


function updateDashboard(){



let expired=0;


let week=0;


let month=0;






reminders.forEach(reminder=>{



const result =
calculateDays(reminder.dueDate);





if(result.expired){


expired++;


}

else if(result.number<=7){


week++;


}

else if(result.number<=30){


month++;


}



});






document.getElementById("totalCount").innerText =

reminders.length;





document.getElementById("weekCount").innerText =

week;





document.getElementById("monthCount").innerText =

month;





document.getElementById("expiredCount").innerText =

expired;



}









// =====================================================
// SEARCH
// =====================================================


searchInput.addEventListener("input",()=>{



searchText =

searchInput.value.toLowerCase();




displayReminders();



});









// =====================================================
// FILTER
// =====================================================


filterSelect.addEventListener("change",()=>{



currentFilter =

filterSelect.value;




displayReminders();



});









// =====================================================
// SORT
// =====================================================


sortSelect.addEventListener("change",()=>{



currentSort =

sortSelect.value;




displayReminders();



});









// =====================================================
// CLEAR FORM
// =====================================================


function clearForm(){



document.getElementById("title").value="";



document.getElementById("dueDate").value="";



document.getElementById("notes").value="";






if(document.getElementById("alertTime")){


document.getElementById("alertTime").value="0";


}




if(document.getElementById("repeat")){


document.getElementById("repeat").value="none";


}



}

// =====================================================
// CATEGORY ICONS
// =====================================================


function getCategoryIcon(category){



const icons = {


"Passport":"🛂",

"Visa / Residency":"🛂",

"National ID":"🪪",

"Vehicle Registration":"🚗",

"Vehicle Insurance":"🚗",

"Driving Licence":"🚘",

"Trade Licence":"🏢",

"Business Permit":"📄",

"Company Documents":"🏭",

"Employee Documents":"👤",

"Contract Renewal":"📝",

"Property / Lease":"🏠",

"Home Maintenance":"🔧",

"Utilities":"💡",

"Subscriptions":"🔄",

"Banking / Finance":"💳",

"Tax / VAT":"💰",

"Medical":"💉",

"Medical Insurance":"💉",

"Dental":"🦷",

"Education":"🎓",

"Travel":"✈️",

"Memberships":"⭐",

"Warranty":"🔧",

"Insurance":"🖊️",

"Appointments":"📅",

"Personal":"👤",

"Other":"📌"


};



return icons[category] || "📌";


}










// =====================================================
// SMART NOTIFICATIONS v1.5
// =====================================================



function requestNotificationPermission(){



if("Notification" in window){



Notification.requestPermission()

.then(permission=>{



if(permission==="granted"){



console.log(

"Remindo notifications enabled"

);



checkReminders();



}



});



}



}









function checkReminders(){



const today = new Date();





reminders.forEach(reminder=>{



const due =

new Date(reminder.dueDate);





const difference =

Math.ceil(

(due - today)

/

(1000*60*60*24)

);





const alertTime =

Number(reminder.alertTime || 0);







// User selected alert date

if(difference === alertTime){



sendNotification(


"Remindo Reminder",


reminder.title +

" is due soon"


);



}






// Expired reminder

if(difference < 0){



sendNotification(


"Reminder Expired",


reminder.title +

" has expired"


);



}





});



}









function sendNotification(title,message){



if(Notification.permission==="granted"){



new Notification(title,{


body:message,


icon:"icon-512.png"



});



}



}









// =====================================================
// START REMINDO
// =====================================================



displayReminders();


updateDashboard();


requestNotificationPermission();
