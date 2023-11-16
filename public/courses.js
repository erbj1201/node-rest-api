"use strict";

window.onload = init;

const url = "http://127.0.0.1:3000/api/courses";
const courseList = document.getElementById("courselist");
// Hämta "Lägg till"-knappen
const addCourseButton = document.getElementById("addCourse");
const message = document.getElementById('message');
var messageTimeout;
// Lägg till en händelselyssnare på knappen
addCourseButton.addEventListener("click", addCourse);

function init() {
    getCourses();
  }
// Hämta alla kurser
function getCourses() {
  fetch(url, {
    method: "GET",
  })
  .then((response) => {
    if (response.status !== 200) {
      // Stanna här om status inte är OK
      return;
      //throw new Error(`Network response was not ok: ${response.status}`);
    }
    // Skicka tillbaka svar i json-format
    return response
        .json()
        .then((data) => writeCourses(data))
        // Visar felmeddelanden i konsollen
        .catch((err) => console.log(err))
 });
}
// Skriv ut kurser
function writeCourses(courses) {
  if (!courses || courses.length === 0) {
    message.innerHTML = 'Det finns inga kurser';
    return;
  }
  courseList.innerHTML = `<tr>
  <th>Kurskod</th>
    <th>Kursnamn</th>
    <th>Period</th>
    <th>Radera</th>
    <th>Ändra</th>
    </tr>`;
  courses.forEach(course => {
    const trEl = document.createElement('tr');
    trEl.innerHTML += `
            <td id='courseid${course._id}' contenteditable>${course.courseId}</td>
            <td id='coursename${course._id}' contenteditable>${course.courseName}</td>
            <td id='courseperiod${course._id}' contenteditable>${course.coursePeriod}</td>
            <td><button data-id='${course._id}' class="delete">Radera</button></td>
            <td><button data-id='${course._id}' class="change">Ändra</button></td>`;
            courseList.appendChild(trEl)
  });
  let deleteBtn = document.querySelectorAll('.delete');
  let changeBtn = document.querySelectorAll('.change');
  deleteBtn.forEach(btn => {
    btn.addEventListener('click', deleteCourse)
  });
changeBtn.forEach(btn => {
    btn.addEventListener('click', updateCourse);
});
}

// Radera kurs
function deleteCourse(event) {
    const target = event.target;
    const id = target.dataset.id;
  // Fetch 
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(data=> getCourses())
   //Visar felmedelanden i konsollen
   .catch(err => console.log(err))
}


// Funktion för att posta en ny kurs
function addCourse(e) {
   e.preventDefault();
    // Samla formulärdata
    var courseId = document.getElementById('courseId').value;
    var courseName = document.getElementById('courseName').value;
    var coursePeriod = document.getElementById('coursePeriod').value;
     // Hämta elementet för felmeddelanden
     var errorMessage = document.getElementById('errorMessage');
     // Rensa tidigare felmeddelanden
     errorMessage.textContent = '';
    //kontrollera inmatning
    if (courseId && courseName && coursePeriod){
    const newCourse = JSON.stringify({
        courseId : courseId,
        courseName : courseName,
        coursePeriod: coursePeriod
    });
        // Utför fetch-requesten för att posta en ny kurs
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: newCourse
        })
        .then(response => response.json())
        .then (data =>getCourses())
          //Visar felmeddelanden
          .catch(err=>console.log(err))
    } else {
        // Hantera fallet där vissa fält inte är ifyllda
        errorMessage.textContent = 'Fyll i alla fält.';
    }
}

// Funktion för att posta en ny kurs eller uppdatera befintlig kurs
async function updateCourse(event) {
    var target = event.target;
    var id = target.dataset.id;
    // Samla formulärdata
    var courseId = document.getElementById(`courseid${id}`).textContent;
    var courseName = document.getElementById(`coursename${id}`).textContent;
    var coursePeriod = document.getElementById(`courseperiod${id}`).textContent;

    // Kontrollera inmatning
    if (courseId && courseName && coursePeriod) {
        var newCourse = JSON.stringify({
            _id: id,
            courseId: courseId,
            courseName: courseName,
            coursePeriod: coursePeriod
        });
        try {
            // Utför fetch-requesten för att posta eller uppdatera en kurs
            const response = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: newCourse,
            });

            const responseText = await response.text();

            console.log(responseText);

            var messageContainer = document.getElementById('message');

            // Create a new element to display the message
            var messageElement = document.createElement('div');
            messageElement.textContent = `Kurs med kurskod: ${courseId} uppdaterad`;

            // Append the message element to the container
            messageContainer.appendChild(messageElement);

            // Set a timeout to remove the message after 3 seconds (adjust as needed)
            setTimeout(() => {
                messageElement.remove();
            }, 3000);

            getCourses();
        } catch (error) {
            console.log(error);
        }
    } else {
        // Hantera fallet där vissa fält inte är ifyllda
        errorMessage.textContent = "Fyll i alla fält.";
    }
}
