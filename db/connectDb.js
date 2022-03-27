const mongoose = require('mongoose');
require('colors');

const connectDB = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log(`Connected to MongoDB → ${url}`.gray.bold));
};

module.exports = connectDB;
