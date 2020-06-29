const express = require('express');
const { persons } = require('./persons');
const PORT = 3001;

const app = express();

app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  console.log(persons);
  response.send(`
    <p>Phonebook has info for ${persons.length}</p>
    <p>${new Date().toString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
