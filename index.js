require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

let { persons } = require('./persons');
const logger = require('./logger');
const Person = require('./models/person');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(morgan(logger));

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => response.json(result));
});

app.get('/info', (request, response) => {
  Person.find({}).then((persons) =>
    response.send(`
      <p>Phonebook has info for ${persons.length}</p>
      <p>${new Date().toString()}</p>
    `)
  );
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = +request.params;
  Person.find({ _id: id }).then((person) => response.json(person));
});

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;

  Person.deleteOne({ _id: id }).then(() => response.status(204).end());
});

app.post('/api/persons', (request, response) => {
  const { body: person = null } = request;
  let error;

  if (!person) {
    return sendError('Content is missing');
  }

  if (!person.number) {
    return sendError('number is required');
  }

  if (!person.name) {
    return sendError('name is required');
  }

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

  if (error) {
    return sendError(error);
  }

  Person.create(person).then((inserted) => response.json(inserted));

  function sendError(error) {
    response.status(404).json({ error });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
