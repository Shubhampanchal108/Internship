const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.mongoDb;
console.log("MongoDB URL:", url);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongoDB;