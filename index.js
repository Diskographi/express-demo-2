const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

/* This is express middleware that parses incoming requests with JSON 
payloads(relevant info in a body of data */

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

//The list of pre-set courses which we can modify, add to, or subtract from

app.get('/', (req, res) => {
   res.send('Base page. Try looking through the courses available!'); 
});

//how to handle just the base url without endpoints/resources

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// sending a JSON list of key-value pairs for the courses

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//Post middleware with error handling; condensed return.
//If an error occurs, the specific error will be mentioned via the Joi dependency
//Takes the length of courses and adds an ID number of one more than that.
//Adds the verified course to the array of courses and responds with said array.

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

//Middleware to change a course after validation and sends the ammended course

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

//via parseInt, the arguement is stringified to match id
//if not a course, a 404 error is sent
//the key-value pair is spliced at the index by 1
//The deleted course is sent for verification of action

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

// DRY function for Joi course validation

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

//a specific course is got after verification

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
