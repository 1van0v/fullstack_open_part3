const express = require('express');
const notes = require('./notes');
const PORT = 3001;

const app = express();

app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(notes);
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
