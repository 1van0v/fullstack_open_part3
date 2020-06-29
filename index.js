const express = require('express');
const morgan = require('morgan');

let { persons } = require('./persons');
const getId = require('./idGenerator');
const logger = require('./logger');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(morgan(logger));

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

app.get('/api/persons/:id', (request, response) => {
  const requestedId = +request.params.id;
  const person = persons.find(({ id }) => id === requestedId);

  if (person) {
    return response.json(person);
  }

  response.status(404).json({ error: 'Cannot find the requested person' });
});

app.delete('/api/persons/:id', (request, response) => {
  const idToDelete = +request.params.id;

  persons = persons.filter(({ id }) => id !== idToDelete);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  console.log('received', request.body);
  const { body: person = null } = request;
  let error = person ? '' : 'Content is missing';

  if ((person && !person.number) || !person.number.length) {
    error = 'number is required';
  }

  if ((person && !person.name) || !person.name.length) {
    error = 'name is required';
  }

  if (!error) {
    persons.some(({ name, number }) => {
      let property = null;
      if (name === person.name) {
        property = 'name';
      }
      if (number === person.number) {
        property = 'number';
      }
      if (property) {
        error = `${property} should be unique`;
        return true;
      }
    });
  }

  if (error) {
    return response.status(404).json({ error });
  }

  person.id = getId();

  persons = persons.concat(person);

  response.json(person);
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
