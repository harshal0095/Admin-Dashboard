import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin-dashboard';

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    const user = await User.findOne({ email: 'prayagkansara05@gmail.com' });
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash exists:', !!user.password);
    } else {
      console.log('User NOT found');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUser();
