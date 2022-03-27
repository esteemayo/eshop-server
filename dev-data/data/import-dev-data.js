const dotenv = require('dotenv');
const fs = require('fs');
require('colors');

// models
const User = require('../../models/User');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

// MongoDB connection string
const connectDB = require('../../db/connectDb');

dotenv.config({ path: './config.env' });

// db local
const db = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongoURI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// MongoDB connection
connectDB(mongoURI);

// read JSON file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const carts = JSON.parse(fs.readFileSync(`${__dirname}/carts.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// import data into database
const loadData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    // await Cart.create(carts);
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
    // await Cart.deleteMany();
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
