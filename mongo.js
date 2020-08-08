const mongoose = require('mongoose');

const argsLength = process.argv.length;

if (argsLength < 3) {
  console.log(
    'Please provide the password as a argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fs_db_user:${password}@cluster0.fk15b.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = new mongoose.model('Person', personSchema);

if (argsLength === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach(({ name, number }) => console.log(name, number));
    mongoose.connection.close();
  });
  process.exit();
}

if (argsLength < 5) {
  console.log(
    "Please specify person's name and number: node mongo.js <password> <Name> <number>"
  );
  process.exit(1);
}

if (argsLength >= 5) {
  addPerson(...process.argv.slice(3, 5))
    .save()
    .then(({ name, number }) => {
      console.log(`Added ${name} ${number} to phonebook`);
      mongoose.connection.close();
    });
}

function addPerson(name, number) {
  if (!name.length) {
    throw new Error('Name should contain only alphanumeric characters');
  }

  if (!number.length) {
    throw new Error('Number should be specified');
  }

  return new Person({ name, number });
}
