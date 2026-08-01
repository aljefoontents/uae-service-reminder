/* =====================================================
   UAE Service Reminder
   Version 0.4
   Reminder Engine + Edit Feature
   ===================================================== */


// -----------------------------
// Data
// -----------------------------

let reminders = JSON.parse(
    localStorage.getItem("reminders")
) || [];


let editingId = null;



// -----------------------------
// Elements
// -----------------------------

const addBtn =
document.getElementById(
    "addReminderBtn"
);


const modal =
document.getElementById(
    "modal"
);


const cancelBtn =
document.getElementById(
    "cancelReminder"
);


const saveBtn =
document.getElementById(
    "saveReminder"
);


const reminderContainer =
document.getElementById(
    "reminderContainer"
);



// -----------------------------
// Open Add Modal
// -----------------------------

addBtn.addEventListener(
"click",
()=>{

    editingId = null;

    clearForm();

    modal.classList.remove(
        "hidden"
    );

});



// -----------------------------
// Close Modal
// -----------------------------

cancelBtn.addEventListener(
"click",
()=>{

    modal.classList.add(
        "hidden"
    );

});




// -----------------------------
// Save Reminder
// -----------------------------

saveBtn.addEventListener(
"click",
()=>{


    const category =
    document.getElementById(
        "category"
    ).value;



    const title =
    document.getElementById(
        "title"
    ).value.trim();



    const dueDate =
    document.getElementById(
        "dueDate"
    ).value;



    const notes =
    document.getElementById(
        "notes"
    ).value.trim();



    if(
        title === "" ||
        dueDate === ""
    ){

        alert(
        "Please enter title and due date"
        );

        return;

    }



    if(editingId){


        reminders =
        reminders.map(
        item =>

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


        editingId = null;


    }

    else{


        const reminder = {


            id:Date.now(),

            category,

            title,

            dueDate,

            notes,


            created:
            new Date()
            .toISOString()

        };


        reminders.push(
            reminder
        );


    }



    saveData();


    displayReminders();


    updateDashboard();


    clearForm();


    modal.classList.add(
        "hidden"
    );


});





// -----------------------------
// Save Storage
// -----------------------------

function saveData(){


    localStorage.setItem(

        "reminders",

        JSON.stringify(
            reminders
        )

    );


}




// -----------------------------
// Display Cards
// -----------------------------

function displayReminders(){


    reminderContainer.innerHTML="";



    if(
        reminders.length === 0
    ){


        reminderContainer.innerHTML=`

        <div class="empty-state">

        <h2>No Reminders Yet</h2>

        <p>
        Click + to add your first reminder.
        </p>

        </div>

        `;


        return;


    }




    reminders.forEach(
    reminder=>{


        const days =
        calculateDays(
            reminder.dueDate
        );



        let status =
        "safe";



        if(days.expired){

            status =
            "expired";

        }

        else if(
            days.number <= 7
        ){

            status =
            "urgent";

        }

        else if(
            days.number <= 30
        ){

            status =
            "warning";

        }




        const card =
        document.createElement(
            "div"
        );



        card.className =
        "reminder-card "
        +
        status;




        card.innerHTML = `


        <span class="category">

        ${reminder.category}

        </span>



        <h2>

        ${reminder.title}

        </h2>




        <p>

        <strong>Due:</strong>

        ${formatDate(
            reminder.dueDate
        )}

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



        reminderContainer.appendChild(
            card
        );


    });


}



// -----------------------------
// Edit Reminder
// -----------------------------

function editReminder(id){



    const reminder =
    reminders.find(
        item =>
        item.id === id
    );



    if(!reminder){

        return;

    }



    document.getElementById(
        "category"
    ).value =
    reminder.category;



    document.getElementById(
        "title"
    ).value =
    reminder.title;



    document.getElementById(
        "dueDate"
    ).value =
    reminder.dueDate;



    document.getElementById(
        "notes"
    ).value =
    reminder.notes;



    editingId =
    id;



    modal.classList.remove(
        "hidden"
    );


}




// -----------------------------
// Delete Reminder
// -----------------------------

function deleteReminder(id){



    if(
        confirm(
        "Delete this reminder?"
        )
    ){


        reminders =
        reminders.filter(
            item =>
            item.id !== id
        );



        saveData();


        displayReminders();


        updateDashboard();


    }


}





// -----------------------------
// Date Calculation
// -----------------------------

function calculateDays(date){



    const today =
    new Date();


    today.setHours(
        0,0,0,0
    );



    const expiry =
    new Date(date);


    expiry.setHours(
        0,0,0,0
    );



    const difference =
    expiry - today;



    const days =
    Math.ceil(

        difference /

        (1000*60*60*24)

    );




    if(days < 0){


        return {


            number:
            Math.abs(days),


            expired:true,


            text:

            "Expired "

            +

            Math.abs(days)

            +

            " days ago"


        };


    }




    if(days === 0){


        return {


            number:0,


            expired:false,


            text:

            "Expires Today"


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




// -----------------------------
// Date Format
// -----------------------------

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





// -----------------------------
// Dashboard
// -----------------------------

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

        else if(
            result.number <= 7
        ){

            week++;

        }

        else if(
            result.number <=30
        ){

            month++;

        }


    });



    document.getElementById(
        "totalCount"
    ).innerText =
    reminders.length;



    document.getElementById(
        "weekCount"
    ).innerText =
    week;



    document.getElementById(
        "monthCount"
    ).innerText =
    month;



    document.getElementById(
        "expiredCount"
    ).innerText =
    expired;



}





// -----------------------------
// Clear Form
// -----------------------------

function clearForm(){


    document.getElementById(
        "title"
    ).value="";


    document.getElementById(
        "dueDate"
    ).value="";


    document.getElementById(
        "notes"
    ).value="";


}





// -----------------------------
// Start App
// -----------------------------

displayReminders();

updateDashboard();
