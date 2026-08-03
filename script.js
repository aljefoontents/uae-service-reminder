/* =====================================================
   REMINDO v1.0
   Never Miss What Matters.
===================================================== */


let reminders =
JSON.parse(localStorage.getItem("reminders")) || [];


let editingId = null;

let searchText = "";

let currentFilter = "all";

let currentSort = "nearest";




// ELEMENTS

const addBtn =
document.getElementById("addReminderBtn");

const modal =
document.getElementById("modal");

const cancelBtn =
document.getElementById("cancelReminder");

const saveBtn =
document.getElementById("saveReminder");

const reminderContainer =
document.getElementById("reminderContainer");

const searchInput =
document.getElementById("searchInput");

const filterSelect =
document.getElementById("filterSelect");

const sortSelect =
document.getElementById("sortSelect");





// OPEN MODAL

addBtn.addEventListener(
"click",
()=>{

editingId = null;

clearForm();

modal.classList.remove("hidden");

});




// CLOSE MODAL

cancelBtn.addEventListener(
"click",
()=>{

modal.classList.add("hidden");

});





// SAVE REMINDER

saveBtn.addEventListener(
"click",
()=>{


const category =
document.getElementById("category").value;


const title =
document.getElementById("title").value.trim();


const dueDate =
document.getElementById("dueDate").value;


const notes =
document.getElementById("notes").value.trim();



if(title === "" || dueDate === ""){

alert("Please enter title and due date");

return;

}




if(editingId){


reminders =
reminders.map(item =>

item.id === editingId

?

{

...item,

category,

title,

dueDate,

notes

}

:

item

);


}

else{


reminders.push({

id: Date.now(),

category,

title,

dueDate,

notes,

created:
new Date().toISOString()

});


}




editingId = null;


saveData();

displayReminders();

updateDashboard();

clearForm();


modal.classList.add("hidden");


});






// STORAGE

function saveData(){

localStorage.setItem(
"reminders",
JSON.stringify(reminders)
);

}







// DISPLAY REMINDERS

function displayReminders(){


reminderContainer.innerHTML = "";



let filtered = reminders.filter(
reminder=>{


const days =
calculateDays(
reminder.dueDate
);



// SEARCH

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





// FILTER FIXED

let filterMatch = true;



if(currentFilter === "expired"){


filterMatch =
days.expired;


}


else if(currentFilter === "urgent"){


filterMatch =

!days.expired &&

days.number >= 0 &&

days.number <= 7;


}


else if(currentFilter === "upcoming"){


filterMatch =

!days.expired &&

days.number > 7;


}


else if(currentFilter === "all"){


filterMatch = true;


}



return searchMatch && filterMatch;


});







// SORT

filtered.sort(
(a,b)=>{


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


return a.title.localeCompare(
b.title
);


}



if(currentSort==="newest"){


return b.id-a.id;


}


});







if(filtered.length === 0){


reminderContainer.innerHTML = `

<div class="empty-state">

<h2>
No Reminders Found
</h2>

<p>
Try changing your filter.
</p>

</div>

`;


return;


}







filtered.forEach(
reminder=>{


const days =
calculateDays(
reminder.dueDate
);



let status = "safe";



if(days.expired){

status = "expired";

}

else if(days.number <=7){

status = "urgent";

}

else if(days.number <=30){

status = "warning";

}






const card =
document.createElement("div");



card.className =
"reminder-card " + status;





card.innerHTML = `


<span class="category">

${reminder.category}

</span>



<h2>

${reminder.title}

</h2>



<p>

<strong>Due:</strong>

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







// EDIT

function editReminder(id){


const reminder =
reminders.find(
item=>item.id===id
);



if(!reminder) return;



document.getElementById("category").value =
reminder.category;


document.getElementById("title").value =
reminder.title;


document.getElementById("dueDate").value =
reminder.dueDate;


document.getElementById("notes").value =
reminder.notes;



editingId = id;


modal.classList.remove("hidden");


}







// DELETE

function deleteReminder(id){


if(confirm("Delete this reminder?")){


reminders =
reminders.filter(
item=>item.id!==id
);



saveData();

displayReminders();

updateDashboard();


}


}







// DATE CALCULATION

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
"Expired " +
Math.abs(days) +
" days ago"

};


}



if(days === 0){


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
days +
" Days Remaining"

};


}







// DATE FORMAT

function formatDate(date){


return new Date(date)
.toLocaleDateString(
"en-GB",
{

day:"2-digit",

month:"long",

year:"numeric"

}

);


}







// DASHBOARD

function updateDashboard(){


let expired = 0;

let week = 0;

let month = 0;



reminders.forEach(
reminder=>{


const result =
calculateDays(
reminder.dueDate
);



if(result.expired){

expired++;

}

else if(result.number <=7){

week++;

}

else if(result.number <=30){

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







// SEARCH

searchInput.addEventListener(
"input",
()=>{


searchText =
searchInput.value.toLowerCase();


displayReminders();


});






// FILTER

filterSelect.addEventListener(
"change",
()=>{


currentFilter =
filterSelect.value;


displayReminders();


});







// SORT

sortSelect.addEventListener(
"change",
()=>{


currentSort =
sortSelect.value;


displayReminders();


});







// CLEAR FORM

function clearForm(){


document.getElementById("title").value="";


document.getElementById("dueDate").value="";


document.getElementById("notes").value="";


}







// START APP

displayReminders();

updateDashboard();
