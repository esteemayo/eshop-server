import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'colors';

// models
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';

// MongoDB connection string
import connectDB from '../../db/connectDb.js';

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
connectDB();

// read JSON file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// import data into database
const loadData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Order.create(orders);
    await Product.create(products);
    console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
    process.exit();
  } catch (e) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold
    );
    console.error(e);
    process.exit();
  }
};

// delete data from database
const removeData = async () => {
  try {
    console.log('😢😢 Goodbye Data...'.blue.bold);
    await User.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    console.log(
      'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green
        .bold
    );
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  loadData();
} else if (process.argv[2] === '--delete') {
  removeData();
}
