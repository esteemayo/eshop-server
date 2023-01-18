import dotenv from 'dotenv';
import mongoose from 'mongoose';

const devEnv = process.env !== 'production';
const { DATABASE, DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;

const dbLocal = DATABASE_LOCAL;
const mongoURI = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

const db = devEnv ? dbLocal : mongoURI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db);
    console.log(`Connected to MongoDB → ${conn.connection.port}`.gray.bold);
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  ;
})

export default connectDB;
