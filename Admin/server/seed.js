import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin-dashboard';

const fallbackUsers = [
  {
    name: 'Harshal Panchal',
    email: 'harshalpanchal4517@gmail.com',
    password: 'Harshu@#0095',
    role: 'admin'
  }
];

const fallbackProducts = [
  { name: 'Quantum Watch', price: 599, stock: 12 },
  { name: 'Neural Link Gen 2', price: 1299, stock: 5 },
  { name: 'Sonic Earbuds', price: 199, stock: 45 },
  { name: 'Holographic Tablet', price: 899, stock: 20 }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});

    for (const u of fallbackUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const newUser = new User({ ...u, password: hashedPassword });
      await newUser.save();
      console.log(`User created: ${u.email}`);
    }

    for (const p of fallbackProducts) {
      const newProduct = new Product(p);
      await newProduct.save();
      console.log(`Product created: ${p.name}`);
    }

    console.log('Seeding complete!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

seed();
