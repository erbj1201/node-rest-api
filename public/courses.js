window.onload = init;

function init() {
    getCourses();
}

const url = "http://127.0.0.1:3000/api/courses";
const courseList = document.getElementById('courselist');

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
            .catch(err => console.log(err));
        })
      
}

// Skriv ut kurser
function writeCourses(courses) {
    if (!courses || courses.length === 0) {
        console.error("No courses found");
        return;
    }

    // Clear existing content
    courseList.innerHTML = "";

    courses.forEach(function (course) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course._id}</td>
            <td>${course.courseId}</td>
            <td>${course.courseName}</td>
            <td>${course.coursePeriod}</td>
            <td><button onclick="deleteCourse(${course._id})">Radera</button></td>
            <td><button onclick="getCourseToUpdate(${course._id})">Ändra</button></td>
        `;
        courseList.appendChild(row);
    });
}

// Function to fetch and populate course data for change
function getCourseToUpdate(_id) {
    // Fetch the current course data
    fetch(`${url}/${_id}`)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            // Parse the response JSON
            return response.json();
        })
        .then((course) => {
            // Populate form fields with existing data
            document.getElementById('courseId').value = course.courseId;
            document.getElementById('courseName').value = course.courseName;
            document.getElementById('coursePeriod').value = course.coursePeriod;

            // Add a hidden input field to store the course ID
            const hiddenIdInput = document.getElementById('hiddenId');
            hiddenIdInput.value = _id;

            // Change the label of the submit button to "Ändra"
            const addCourseButton = document.getElementById('addCourse');
            addCourseButton.value = 'Ändra';
        })
        .catch((error) => console.error("Error fetching course data:", error));
}

    // Function to delete a course
function deleteCourse(_id) {
    // Confirm with the user before proceeding with the deletion
    const confirmation = confirm("Are you sure you want to delete this course?");
    
    if (!confirmation) {
        // If the user cancels the deletion, do nothing
        return;
    }

    // Fetch request to delete the course
    fetch(`${url}/${_id}`, {
        method: "DELETE",
    })
    .then((response) => {
        if (response.status !== 200) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        // Optionally, update the course list after deletion
        getCourses();
        console.log(`Deleting course with ID ${_id}`);
    })
    .then(() => console.log(`Course with ID ${courseId} deleted successfully.`))
    .catch((error) => console.error("Error deleting course:", error));
    // Implement your delete logic here
    console.log(`Deleting course with ID ${_id}`);
}

// Funktion för att posta en ny kurs
/*function addCourse() {
    // Samla formulärdata
    const courseId = document.getElementById('courseId').value;
    const courseName = document.getElementById('courseName').value;
    const coursePeriod = document.getElementById('coursePeriod').value;

    // Hämta elementet för felmeddelanden
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Rensa tidigare felmeddelanden
    errorMessage.textContent = '';
    successMessage.textContent = '';

    // Kontrollera om alla obligatoriska fält är ifyllda
    if (courseId && courseName && coursePeriod) {
        // Skapa ett objekt med formulärdatan
        const newCourseData = {
            courseId: courseId,
            courseName: courseName,
            coursePeriod: coursePeriod
            // Lägg till andra egenskaper vid behov
        };

        // Utför fetch-requesten för att posta en ny kurs
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCourseData),
        })
            .then((response) => {
                if (response.status !== 200) {
                    // Stanna här om status inte är OK
                    throw new Error(`Nätverkssvar var inte OK: ${response.status}`);
                }
                // Skicka tillbaka svar i json-format
                return response.json();
            })
            .then((data) => {
                console.log('Server response:', data);
                successMessage.textContent = `Kurs tillagd med ID: ${data.courseId}`;
                // Valgfritt: Uppdatera kurslistan efter att ha postat en ny kurs
                getCourses();
            })
            .catch((error) => {
                console.error("Kunde inte lägga till kurs:", error);
                // Visa felmeddelande ovanför formuläret
                errorMessage.textContent = 'Något gick fel. Försök igen.';
            });
    } else {
        // Hantera fallet där vissa fält inte är ifyllda
        errorMessage.textContent = 'Fyll i alla fält.';
    }
}*/

// Funktion för att posta en ny kurs eller uppdatera befintlig kurs
function addOrUpdateCourse() {
    // Samla formulärdata
    const courseId = document.getElementById('courseId').value;
    const courseName = document.getElementById('courseName').value;
    const coursePeriod = document.getElementById('coursePeriod').value;

    // Hämta elementet för felmeddelanden
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Rensa tidigare felmeddelanden
    errorMessage.textContent = '';
    successMessage.textContent = '';

    // Hämta värdet från hiddenId
    const _id = document.getElementById('hiddenId').value;

    // Kontrollera om alla obligatoriska fält är ifyllda
    if (courseId && courseName && coursePeriod) {
        // Skapa ett objekt med formulärdatan
        const newCourseData = {
            courseId: courseId,
            courseName: courseName,
            coursePeriod: coursePeriod
            // Lägg till andra egenskaper vid behov
        };

        // Utför fetch-requesten för att posta eller uppdatera en kurs
        fetch(_id ? `${url}/${_id}` : url, {
            method: _id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCourseData),
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error(`Nätverkssvar var inte OK: ${response.status}`);
                }
                // Skicka tillbaka svar i json-format
                return response.json();
            })
            .then((data) => {
                console.log('Server response:', data);
                const message = _id ? 'Kurs uppdaterad.' : `Kurs tillagd med ID: ${data.courseId}`;
                successMessage.textContent = message;
                // Valgfritt: Uppdatera kurslistan efter att ha postat eller uppdaterat en kurs
                getCourses();
            })
            .catch((error) => {
                console.error("Kunde inte lägga till/uppdatera kurs:", error);
                // Visa felmeddelande ovanför formuläret
                errorMessage.textContent = 'Något gick fel. Försök igen.';
            });
    } else {
        // Hantera fallet där vissa fält inte är ifyllda
        errorMessage.textContent = 'Fyll i alla fält.';
    }
}

// Hämta "Lägg till"-knappen
const addCourseButton = document.getElementById('addCourse');

// Lägg till en händelselyssnare på knappen
addCourseButton.addEventListener('click', function (event) {
    event.preventDefault();
    // Anropa addOrUpdateCourse-funktionen när knappen klickas
    addOrUpdateCourse();
});

// Lägg till en händelselyssnare på knappen
addCourseButton.addEventListener('click', function (event) {
    event.preventDefault();
    // Anropa addCourse-funktionen när knappen klickas
    addCourse();
});