require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://abdullahmumtazfsd:7Ni6hppFACGKNWqC@medinova.xrzrbvi.mongodb.net/?retryWrites=true&w=majority&appName=medinova');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
