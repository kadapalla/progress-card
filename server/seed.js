require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Component = require('./src/models/Component');
const RentalTransaction = require('./src/models/RentalTransaction');
const Lecture = require('./src/models/Lecture');
const WalletTransaction = require('./src/models/WalletTransaction');
const Lab = require('./src/models/Lab');
const ExplanationRequest = require('./src/models/ExplanationRequest');

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

    await User.deleteMany({});
    await Component.deleteMany({});
    await RentalTransaction.deleteMany({});
    await Lecture.deleteMany({});
    await WalletTransaction.deleteMany({});
    await Lab.deleteMany({});
    await ExplanationRequest.deleteMany({});

    const admin = new User({ name: 'Admin User', email: 'admin@lab.com', password: 'password123', role: 'admin' });
    const teacher = new User({ name: 'Teacher User', email: 'teacher@lab.com', password: 'password123', role: 'teacher' });
    
    await admin.save();
    await teacher.save();

    const components = await Component.insertMany(MOCK_COMPONENTS);

    const arduino = components.find(c => c.name === 'Arduino Uno R3');
    const led = components.find(c => c.name === 'Jumper Wires (M-M)'); 
    const breadboard = components.find(c => c.name === 'Breadboard');
    const ultrasonic = components.find(c => c.name === 'Ultrasonic Sensor');
    const servo = components.find(c => c.name === 'Servo Motor');

    // Create 5 lectures of varying categories
    const lecture1 = new Lecture({
      title: 'Introduction to Arduino (Easy)',
      description: 'Learn the basics of Arduino programming and circuit design.',
      videoUrl: 'https://www.youtube.com/watch?v=nL34zDTPkcs',
      requiredEquipment: [arduino?._id, led?._id].filter(Boolean),
      prerequisites: [],
      language: 'English',
      difficulty: 'Beginner',
      category: 'easy',
      department: 'Electronics'
    });
    await lecture1.save();

    const lecture2 = new Lecture({
      title: 'Breadboard Prototyping (Easy)',
      description: 'Learn how to proto circuits using a breadboard.',
      videoUrl: 'https://www.youtube.com/watch?v=6WReFkfrUIk',
      requiredEquipment: [breadboard?._id, led?._id].filter(Boolean),
      prerequisites: [],
      language: 'English',
      difficulty: 'Beginner',
      category: 'easy',
      department: 'Electronics'
    });
    await lecture2.save();

    const lecture3 = new Lecture({
      title: 'Ultrasonic Distance Meter (Medium)',
      description: 'Measure distance using ultrasonic waves and Arduino.',
      videoUrl: 'https://www.youtube.com/watch?v=Z3XIDhXqAFA',
      requiredEquipment: [arduino?._id, breadboard?._id, ultrasonic?._id].filter(Boolean),
      prerequisites: [lecture1._id],
      language: 'English',
      difficulty: 'Intermediate',
      category: 'medium',
      department: 'Electronics'
    });
    await lecture3.save();

    const lecture4 = new Lecture({
      title: 'Servo Motor Steering (Medium)',
      description: 'Control motor positions with PWM code.',
      videoUrl: 'https://www.youtube.com/watch?v=SGwGiL0Ougc',
      requiredEquipment: [arduino?._id, servo?._id].filter(Boolean),
      prerequisites: [lecture1._id],
      language: 'English',
      difficulty: 'Intermediate',
      category: 'medium',
      department: 'Electronics'
    });
    await lecture4.save();

    const lecture5 = new Lecture({
      title: 'Automated Obstacle Avoidance (Hard)',
      description: 'Combine servo and distance sensors to build an autonomous robot.',
      videoUrl: 'https://www.youtube.com/watch?v=p1t3Fm-0Bf4',
      requiredEquipment: [arduino?._id, ultrasonic?._id, servo?._id].filter(Boolean),
      prerequisites: [lecture3._id, lecture4._id],
      language: 'English',
      difficulty: 'Advanced',
      category: 'hard',
      department: 'Electronics'
    });
    await lecture5.save();

    // Create student users with varying explanation histories
    
    // Student 1 (John Doe): Completed easy labs, explained to 2 students. Met medium requirements, but not hard.
    const student1 = new User({
      name: 'John Doe',
      email: 'student@lab.com',
      password: 'password123',
      role: 'student',
      completedLectures: [lecture1._id, lecture2._id]
    });
    await student1.save();

    // Student 2 (Alice): Completed easy & medium labs, explained to 4 students (including 2 medium explanations). Met hard requirements.
    const student2 = new User({
      name: 'Alice Cooper',
      email: 'alice@lab.com',
      password: 'password123',
      role: 'student',
      completedLectures: [lecture1._id, lecture2._id, lecture3._id, lecture4._id]
    });
    await student2.save();

    // Student 3 (Bob): Completed easy, explained to 0. Locked out of medium and hard.
    const student3 = new User({
      name: 'Bob Marley',
      email: 'bob@lab.com',
      password: 'password123',
      role: 'student',
      completedLectures: [lecture1._id, lecture2._id]
    });
    await student3.save();

    // Student 4 (Charlie): Admin bypass toggled to true. Can access all labs immediately.
    const student4 = new User({
      name: 'Charlie Brown',
      email: 'charlie@lab.com',
      password: 'password123',
      role: 'student',
      bypassLabRequirements: true,
      completedLectures: [lecture1._id, lecture2._id]
    });
    await student4.save();

    // Other students to receive explanations
    const student5 = new User({ name: 'Dave Miller', email: 'dave@lab.com', password: 'password123', role: 'student', completedLectures: [] });
    const student6 = new User({ name: 'Eva Longoria', email: 'eva@lab.com', password: 'password123', role: 'student', completedLectures: [] });
    await student5.save();
    await student6.save();

    // Create completed explanations to back up stats
    
    // John Doe (student1) explained lecture1 (easy) to Dave (student5) & Eva (student6)
    const exp1 = new ExplanationRequest({ studentId: student5._id, lectureId: lecture1._id, explainerId: student1._id, status: 'completed' });
    const exp2 = new ExplanationRequest({ studentId: student6._id, lectureId: lecture1._id, explainerId: student1._id, status: 'completed' });
    await exp1.save();
    await exp2.save();

    // Alice (student2) explained to 4 students, with 2 explanations for medium labs:
    // - explained lecture1 (easy) to Bob (student3)
    // - explained lecture2 (easy) to Charlie (student4)
    // - explained lecture3 (medium) to Dave (student5)
    // - explained lecture3 (medium) to Eva (student6)
    const exp3 = new ExplanationRequest({ studentId: student3._id, lectureId: lecture1._id, explainerId: student2._id, status: 'completed' });
    const exp4 = new ExplanationRequest({ studentId: student4._id, lectureId: lecture2._id, explainerId: student2._id, status: 'completed' });
    const exp5 = new ExplanationRequest({ studentId: student5._id, lectureId: lecture3._id, explainerId: student2._id, status: 'completed' });
    const exp6 = new ExplanationRequest({ studentId: student6._id, lectureId: lecture3._id, explainerId: student2._id, status: 'completed' });
    await exp3.save();
    await exp4.save();
    await exp5.save();
    await exp6.save();

    // Seed some pending requests for students to accept
    const pendingReq1 = new ExplanationRequest({ studentId: student5._id, lectureId: lecture2._id, status: 'pending' });
    const pendingReq2 = new ExplanationRequest({ studentId: student6._id, lectureId: lecture1._id, status: 'pending' });
    await pendingReq1.save();
    await pendingReq2.save();

    // Add wallet balance logs
    const initialLog = new WalletTransaction({
      userId: student1._id,
      updatedBy: admin._id,
      amount: 500,
      type: 'topup',
      previousBalance: 0,
      newBalance: 500,
      description: 'Initial balance top-up by administrator'
    });
    await initialLog.save();

    const physicsLab = new Lab({
      name: 'General Physics & Electronics Lab',
      description: 'Main laboratory for elementary circuits and sensor integrations.',
      manager: teacher._id,
      assistants: [student1._id],
      components: [arduino?._id, breadboard?._id].filter(Boolean)
    });
    await physicsLab.save();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
