//importera joi
const Joi = require('joi');
// Importera express
const express = require('express');
//Importera fs för att kommunicera med json-fil
const fs = require('fs').promises;
const jsonCourses = 'courses.json'
//Skapa app med express och konfigurera att analysera förfrågningar med JSON
const app = express ();
app.use(express.json());

//Validera med hjälp av Joi
const courseSchema = Joi.object({
    courseId: Joi.string().min(4).required(),
    courseName: Joi.string().min(4).required(),
    coursePeriod: Joi.number().max(4).required(),
});
//Routes
app.get('/', async (req, res) => {
try {
    const data = await fs.readFile(jsonCourses);
    const courses = JSON.parse(data);
    res.send(courses);
} catch (error) {
    console.error(error);
    res.status(500).send('Tekniskt fel')
}
});
//Hämta alla kurser
app.get('/courses', async (req, res) =>{
    try {
        const data = await fs.readFile(jsonCourses);
        const courses = JSON.parse(data);
        res.send(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Tekniskt fel')
    }
});
//Hämta specifik kurs med id
app.get('/courses/:id', (req, res)=>{
    //Hitta kurs med angivet id och omvandla id från string till integer
    const course = course.find(c => c.id===parseInt(req.params.id));
    //Kontrollera om kurs finns, om inte returnera 404 
    if (!course) res.status(404).send ('Kursen kunde inte hittas.');
    //Returnera kurs med angivet id
    res.send(course);
});

//Lägg till kurs
app.post('/courses', async (req, res) => {
    try {
        const { courseId, courseName, coursePeriod } = req.body;
        // Validate the request body using the defined schema
        const { error } = courseSchema.validate({ courseId, courseName, coursePeriod }, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
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
            coursePeriod
        };
        // Add the new course to the existing courses array
        courses.push(newCourse);
        // Write the updated courses array back to the JSON file
        await fs.writeFile(jsonCourses, JSON.stringify(courses, null, 2));
        res.send(`Kurs tillagd: ${JSON.stringify(newCourse)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Kunde inte lägga till kurs');
    }
});

//Radera kurs med specifikt id
app.delete('/courses/:id', async (req, res) => {
    try {
        const courseIdToDelete = parseInt(req.params.id);
        // Read existing courses from the JSON file
        const data = await fs.readFile(jsonCourses);
        const courses = JSON.parse(data);
        // Find the index of the course with the specified ID
        const index = courses.findIndex(course => course.id === courseIdToDelete);
        if (index === -1) {
            return res.status(404).send('Kursen kunde inte hittas.');
        }
        // Remove the course from the array
        courses.splice(index, 1);
        // Write the updated courses array back to the JSON file
        await fs.writeFile(jsonCourses, JSON.stringify(courses, null, 2));
        res.send('Kurs raderad.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Kunde inte radera kurs');
    }
});

//Port
const port = process.env.PORT || 3000;
//Ställ in server och lyssna efter angiven port
app.listen(port, () => 
    console.log(`Server Listening on port: ${port}`));
