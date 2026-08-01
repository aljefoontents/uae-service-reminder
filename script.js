/* =====================================================
   UAE Service Reminder
   Version 0.2
   Reminder Engine
   ===================================================== */


// -----------------------------
// Variables
// -----------------------------

let reminders = JSON.parse(
    localStorage.getItem("reminders")
) || [];


const addBtn = document.getElementById(
    "addReminderBtn"
);

const modal = document.getElementById(
    "modal"
);

const cancelBtn = document.getElementById(
    "cancelReminder"
);

const saveBtn = document.getElementById(
    "saveReminder"
);


const reminderContainer =
document.getElementById(
    "reminderContainer"
);



// -----------------------------
// Open Modal
// -----------------------------


addBtn.addEventListener(
"click",
()=>{

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
    ).value;


    const dueDate =
    document.getElementById(
        "dueDate"
    ).value;


    const notes =
    document.getElementById(
        "notes"
    ).value;



    if(
        title === "" ||
        dueDate === ""
    ){

        alert(
        "Please enter title and date"
        );

        return;

    }



    const reminder = {


        id:
        Date.now(),


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


    saveData();


    displayReminders();


    updateDashboard();



    clearForm();


    modal.classList.add(
        "hidden"
    );


});




// -----------------------------
// Save Data
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
// Display Reminders
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



        const card =
        document.createElement(
            "div"
        );


        card.className =
        "reminder-card";



        card.innerHTML=`

        <h2>
        ${reminder.title}
        </h2>


        <p>
        Category:
        ${reminder.category}
        </p>


        <p>
        Due:
        ${formatDate(
            reminder.dueDate
        )}
        </p>


        <h3>
        ${days.text}
        </h3>


        <p>
        ${reminder.notes || ""}
        </p>


        <button
        onclick="
        deleteReminder(${reminder.id})
        "
        >
        Delete
        </button>


        `;



        reminderContainer.appendChild(
            card
        );


    });


}



// -----------------------------
// Calculate Days
// -----------------------------


function calculateDays(date){


    const today =
    new Date();


    const expiry =
    new Date(date);



    const difference =
    expiry - today;



    const days =
    Math.ceil(
        difference /
        (1000*60*60*24)
    );



    if(days < 0){

        return{

            text:
            "Expired " +
            Math.abs(days)
            +
            " days ago"

        };

    }



    if(days === 0){

        return{

            text:
            "Expires Today"

        };

    }



    return{

        text:
        days +
        " Days Remaining"

    };


}



// -----------------------------
// Format Date
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
// Delete Reminder
// -----------------------------


function deleteReminder(id){


    reminders =
    reminders.filter(
        reminder =>
        reminder.id !== id
    );


    saveData();


    displayReminders();


    updateDashboard();


}





// -----------------------------
// Dashboard Numbers
// -----------------------------


function updateDashboard(){


document.getElementById(
"totalCount"
).innerText =
reminders.length;



let expired=0;

let week=0;

let month=0;



reminders.forEach(
reminder=>{


const days =
calculateDays(
reminder.dueDate
);



const number =
parseInt(
days.text
);



if(days.text.includes("Expired")){

expired++;

}


else if(number <=7){

week++;

}


else if(number <=30){

month++;

}



});


document.getElementById(
"expiredCount"
).innerText =
expired;


document.getElementById(
"weekCount"
).innerText =
week;


document.getElementById(
"monthCount"
).innerText =
month;


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
// Load App
// -----------------------------


displayReminders();

updateDashboard();
