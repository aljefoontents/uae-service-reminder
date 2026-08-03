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
0;



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


if(item.id===editingId){


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








// SAVE DATA

function saveData(){


localStorage.setItem(

"reminders",

JSON.stringify(reminders)

);


}









// DISPLAY REMINDERS

function displayReminders(){


reminderContainer.innerHTML="";



let filtered = reminders.filter(reminder=>{


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
days.number<=7;


}


else if(currentFilter==="upcoming"){


filterMatch =
!days.expired &&
days.number>7;


}




return searchMatch && filterMatch;


});







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





card.innerHTML=`

<div class="card-header">


<span class="category-icon">

${getCategoryIcon(reminder.category)}

</span>


<span class="category">

${reminder.category}

</span>


</div>



<h2>${reminder.title}</h2>



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
