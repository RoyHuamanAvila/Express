const express = require('express');
const logger = require('morgan');

const app = express();
app.use(express.json());

logger.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(logger(':method :url :status :res[content-length] - :response-time ms - :body'));


const data = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-445323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-23434345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("Hola mundo");
})

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${data.length} people \n - ${date}`);
});

app.get("/api/persons/:id", (req, res) => {
    const person = data.find(person => person.id == req.params.id);
    if (!person) {
        res.status(404).send("ID not found");
    }
    else {
        res.send(JSON.stringify(person));
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const person = data.find(person => person.id == req.params.id);
    if (!person) {
        res.status(404).send("ID not found");
    }
    else {
        data.splice(person, 1);
        res.send(`Deleted person`);
    }
})

app.post("/api/persons", (req, res) => {
    const person = req.body;
    if (!person.name) {
        res.status(505).json({ error: "name is missing" })
    }
    if (!person.number) {
        res.status(505).json({ error: "number is missing" })
    }
    const personName = data.find(user => user.name == person.name);
    if (personName) {
        res.status(505).json({ error: "name must be unique" })
    }
    person.id = Math.floor(Math.random() * 1000);
    data.push(person);
    res.status(201).json(person);
})
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
