require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Component = require('./src/models/Component');
const RentalTransaction = require('./src/models/RentalTransaction');

const MOCK_COMPONENTS = [
  { name: 'Arduino Uno R3', category: 'Microcontrollers', availableQuantity: 12, totalQuantity: 30, description: 'Microcontroller board based on the ATmega328P', imageUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=200' },
  { name: 'Breadboard', category: 'Components', availableQuantity: 5, totalQuantity: 50, description: 'Solderless breadboard for prototyping', imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=200' },
  { name: 'Jumper Wires (M-M)', category: 'Cables', availableQuantity: 450, totalQuantity: 500, description: 'Male to Male jumper wires', imageUrl: 'https://plus.unsplash.com/premium_photo-1678116120530-5840bd49870b?auto=format&fit=crop&q=80&w=200' },
  { name: 'Raspberry Pi 4', category: 'Microcontrollers', availableQuantity: 0, totalQuantity: 10, description: 'Single board computer with 4GB RAM', imageUrl: 'https://images.unsplash.com/photo-1601462904263-228cb61925bf?auto=format&fit=crop&q=80&w=200' },
  { name: 'Ultrasonic Sensor', category: 'Sensors', availableQuantity: 15, totalQuantity: 20, description: 'HC-SR04 distance measuring sensor', imageUrl: 'https://images.unsplash.com/photo-1596733430284-f74370c8151b?auto=format&fit=crop&q=80&w=200' },
  { name: 'Servo Motor', category: 'Motors', availableQuantity: 8, totalQuantity: 15, description: 'SG90 Micro Servo Motor', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/labmanagement');
    console.log('Connected to DB');

    // Clear existing
    await User.deleteMany({});
    await Component.deleteMany({});
    await RentalTransaction.deleteMany({});

    // Create Admin and Student
    const admin = new User({ name: 'Admin User', email: 'admin@lab.com', password: 'password123', role: 'admin' });
    const student = new User({ name: 'John Doe', email: 'student@lab.com', password: 'password123', role: 'student' });
    
    await admin.save();
    await student.save();

    // Insert Components
    await Component.insertMany(MOCK_COMPONENTS);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
