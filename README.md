# node-rest-api

Skapat av Erika Vestin, 2023 
Webbutvecklingsprogrammet, Miun Sundsvall 
Kurs: DT162G - JavaScriptbaserad Webbutveckling 

## Om REST-API:t
API:t är skapat med NodeJs och Express som ramverk. Data som hanteras i webbtjänsten lagras i en json-fil (courses.json). Det som lagras är de kurser som är kvar av Webbutvecklingsprogrammet. 

Webbtjänsten har full CRUD-funktionalitet. Det går att hämta alla kurser, hämta en kurs med specifikt id, lägga till en ny kurs, ändra en befintlig kurs och radera en kurs. 

## Om klienten 
Klientapplikationen är skapad med egenskriven HTML-kod och CSS-kod. Kommunikation med API:t sker med hjälpa av Ajax-anrop med metoden Fetch.


### Endpoints och användning


Metod       Ändpunkt            Beskrivning


GET         /courses            Hämtar alla kurser
GET         /courses/id         Hämtar en specifik kurs med angivet ID. 
POST        /courses            Lagrar en ny kurs. Kräver att ett kurs-objekt skickas med. 
PUT         /courses/id         Uppdaterar en existerande kurs med angivet ID. Kräver att ett kurs-objekt skickas med. 
DELETE      /courses/id         Raderar en kurs med angivet ID.


#### Format på kurs-objekt 

 {
        "_id": 2,
        "courseId": "IK060G",
        "courseName": "Projektledning",
        "coursePeriod": 1
}

