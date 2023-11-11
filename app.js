// Importera express
const express = require("express");
//Skapa app med express och konfigurera att analysera förfrågningar med JSON
const app = express();
app.use(express.json());
//importera joi
const Joi = require("joi");
//Importera fs för att kommunicera med json-fil
const fs = require("fs").promises;
const cors = require('cors');
app.use(cors());
const jsonCourses = "courses.json";


//Validera med hjälp av Joi
const courseSchema = Joi.object({
  courseId: Joi.string().min(4).required(),
  courseName: Joi.string().min(4).required(),
  coursePeriod: Joi.number().max(4).required(),
});
app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(jsonCourses);
    const courses = JSON.parse(data);
    res.send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Tekniskt fel");
  }
});

// Hämta alla kurser
app.get("/api/courses", async (req, res) => {
  try {
    const data = await fs.readFile(jsonCourses);
    const courses = JSON.parse(data);
    res.send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Tekniskt fel");
  }
});
//Hämta specifik kurs med id
app.get("/api/courses/:id", async (req, res) => {
  try {
    // Läs befintliga kurser från JSON-filen
    const data = await fs.readFile(jsonCourses);
    const courses = JSON.parse(data);
    // Hitta kurs med angivet id och omvandla id från string till integer
    const course = courses.find((c) => c._id === parseInt(req.params.id));
    // Kontrollera om kurs finns, om inte returnera 404
    if (!course) res.status(404).send("Kursen kunde inte hittas.");
    // Returnera kurs med angivet id
    res.send(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Tekniskt fel");
  }
});

//Lägg till kurs
app.post("/api/courses", async (req, res) => {
  try {
    const { courseId, courseName, coursePeriod } = req.body;
    // Validate the request body using the defined schema
    const { error } = courseSchema.validate(
      { courseId, courseName, coursePeriod },
      { abortEarly: false }
    );
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).send(errorMessages);
    }
    // Read existing courses from the JSON file
    const data = await fs.readFile(jsonCourses);
    const courses = JSON.parse(data);
    // Create a new course object
    const newCourse = {
      _id: courses.length + 1,
      courseId,
      courseName,
      coursePeriod,
    };
    // Add the new course to the existing courses array
    courses.push(newCourse);
    // Write the updated courses array back to the JSON file
    await fs.writeFile(jsonCourses, JSON.stringify(courses, null, 2));
    res.send(`Kurs tillagd: ${JSON.stringify(newCourse)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Kunde inte lägga till kurs");
  }
});

// Uppdatera kurs med specifikt id
app.put("/api/courses/:_id", async (req, res) => {
  try {
    const courseIdToUpdate = parseInt(req.params._id);
    const { courseId, courseName, coursePeriod } = req.body;
    // Läs befintliga kurser från JSON-filen
    const data = await fs.readFile(jsonCourses);
    let courses = JSON.parse(data);

    // Hitta index för kursen med det angivna ID
    const index = courses.findIndex(
      (course) => course._id === courseIdToUpdate
    );
    // Kontrollera om kursen finns, om inte returnera 404
    if (index === -1) {
      return res.status(404).send("Kursen kunde inte hittas.");
    }
    // Uppdatera kursen
    courses[index].courseId = courseId;
    courses[index].courseName = courseName;
    courses[index].coursePeriod = coursePeriod;
    // Skriv tillbaka den uppdaterade arrayen till JSON-filen
    await fs.writeFile(jsonCourses, JSON.stringify(courses, null, 2));
    // Returnera bekräftelsemeddelande och information om uppdaterad kurs
    res.send(`Kurs uppdaterad: ${JSON.stringify(courses[index])}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Kunde inte uppdatera kurs");
  }
});

//Radera kurs med specifikt id
app.delete("/api/courses/:_id", async (req, res) => {
  try {
    const courseIdToDelete = parseInt(req.params._id);
    // Läs befintliga kurser från JSON-filen
    const data = await fs.readFile(jsonCourses);
    let courses = JSON.parse(data);

    // Hitta index för kursen med det angivna ID
    const index = courses.findIndex(
      (course) => course._id === courseIdToDelete
    );
    // Kontrollera om kursen finns, om inte returnera 404
    if (index === -1) {
      return res.status(404).send("Kursen kunde inte hittas.");
    }
    // Ta bort kursen från arrayen
    const deletedCourse = courses.splice(index, 1)[0];

    // Skriv tillbaka den uppdaterade arrayen till JSON-filen
    await fs.writeFile(jsonCourses, JSON.stringify(courses, null, 2));

    // Returnera bekräftelsemeddelande och information om raderad kurs
    res.send(`Kurs raderad: ${JSON.stringify(deletedCourse)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Kunde inte radera kurs");
  }
});

//Port
const port = process.env.PORT || 3000;
//Ställ in server och lyssna efter angiven port
app.listen(port, () => console.log(`Server Listening on port: ${port}`));
