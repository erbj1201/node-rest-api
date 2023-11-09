//importera joi
const Joi = require('joi');
// Importera express
const express = require('express');
//Importera fs för att kommunicera med json-fil
const fs = require('fs').promises;
const COURSES_FILE_PATH = 'courses.json';
//Skapa app med express och konfigurera att analysera förfrågningar med JSON
const app = express ();
app.use(express.json());

const courses = [
    {id: 1, courseId: 'DT111G', courseName: 'course1', coursePeriod: '1'},
    {id: 2, courseId: 'DT222G', courseName: 'course2', coursePeriod: '2'},
    {id: 3, courseId: 'DT333G', courseName: 'course3', coursePeriod: '3'},
];
//Validera med hjälp av Joi
const courseSchema = Joi.object({
    courseId: Joi.string().min(4).required(),
    courseName: Joi.string().min(4).required(),
    coursePeriod: Joi.string().max(2).required(),
});
//Routes
app.get('/', async (req, res) => {
res.send('Testar app.js')
});
//Hämta alla kurser
app.get('/courses', (req, res) =>{
    //Hämta data från API
res.send(courses);
});
//Hämta specifik kurs med id
app.get('/courses/:id', (req, res)=>{
    //Hitta kurs med angivet id och omvandla id från string till integer
    const course = courses.find(c => c.id===parseInt(req.params.id));
    //Kontrollera om kurs finns, om inte returnera 404 
    if (!course) res.status(404).send ('Kursen kunde inte hittas.');
    //Returnera kurs med angivet id
    res.send(course);
});

//Lägg till kurs
app.post('/courses', (req, res) => {
    //Anger vad bodyn behöver innehålla
    const { courseId, courseName, coursePeriod } = req.body;
    // Validera input med Joi
    const { error } = courseSchema.validate({ courseId, courseName, coursePeriod }, { abortEarly: false });
    if (error){
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).send(errorMessages);
    } 
    // Create a new course object
    const newCourse = {
        id: courses.length + 1, // You might want to generate a unique ID here
        courseId,
        courseName,
        coursePeriod
    };
    // Add the new course to the courses array
    courses.push(newCourse);
    // Return the newly created course in the response
    res.send(`Kurs tillagd: ${JSON.stringify(newCourse)}`);
});

//Radera kurs med specifikt id
app.delete('/courses/:id', (req, res) => {
  //Hitta kurs med angivet id och omvandla id från string till integer
  const course = courses.find(c => c.id===parseInt(req.params.id));
  //Kontrollera om kurs finns, om inte returnera 404 
  if(!course) return res.status(404).send ('Kursen kunde inte hittas.');
  //radera kurs
  const index = courses.indexOf(course);
  courses.splice(index, 1);
//Returnera 
res.send('Kurs raderad');
});

//Port
const port = process.env.PORT || 3000;
//Ställ in server och lyssna efter angiven port
app.listen(port, () => 
    console.log(`Server Listening on port: ${port}`));
