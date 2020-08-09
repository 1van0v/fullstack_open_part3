const mongoose = require('mongoose');

const url = process.env.MONGO_URI;
console.log('connecting to', url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('connected to DB'))
  .catch((error) => console.log('something went wrong', error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'Name should contain at least 3 symbols']
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.match(/\d+/g).join('').length >= 8,
      message: (props) => `${props.value} should contain at least 8 digits`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
