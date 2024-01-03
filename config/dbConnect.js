const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb+srv://siyad:7736711807@cluster0.izl9rfg.mongodb.net/e-commerce');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = dbConnection;
