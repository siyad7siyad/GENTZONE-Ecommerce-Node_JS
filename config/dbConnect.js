const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = dbConnection;
