require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

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

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() =>
    response.status(204).end()
  );
});

app.put('/api/persons/:id', (request, response) => {
  Person.findByIdAndUpdate(request.params.id, request.body, {
    new: true
  }).then((result) => response.json(result));
});

app.post('/api/persons', (request, response, next) => {
  const { body: person = null } = request;

  Person.create(person)
    .then((inserted) => response.json(inserted))
    .catch((error) => next(error));
});

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  console.log('middleware', typeof error, error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed ID' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).send({ error: 'Duplicate key' });
  }

  next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
