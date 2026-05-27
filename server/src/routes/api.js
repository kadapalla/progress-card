const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Component = require('../models/Component');
const RentalTransaction = require('../models/RentalTransaction');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const LabCompletionRequest = require('../models/LabCompletionRequest');
const { protect, restrictTo } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'labmgmt_super_secret_key_2024_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Login Route (Unprotected)
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signup Route (Unprotected)
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;
    
    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Create a new user (defaults to student role)
    const user = new User({
      name,
      email,
      password,
      studentId,
      role: 'student'
    });

    await user.save();

    const token = signToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ALL ROUTES BELOW THIS ARE PROTECTED ---

// Get all components (Student Catalog)
router.get('/components', protect, async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new component (Admin Upload)
router.post('/components', protect, restrictTo('admin'), async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout items (Cart)
router.post('/checkout', protect, async (req, res) => {
  try {
    const { userId, items } = req.body; // items: [{ componentId, quantity, hours }]
    
    const transactions = [];

    // Verify all items have enough quantity first
    for (const item of items) {
      const component = await Component.findById(item.componentId);
      if (!component || component.availableQuantity < item.quantity) {
        return res.status(400).json({ error: `Not enough quantity for ${component?.name || 'unknown item'}` });
      }
    }

    // Process transactions
    for (const item of items) {
      const component = await Component.findById(item.componentId);
      
      const dueTime = new Date();
      dueTime.setHours(dueTime.getHours() + item.hours);

      const transaction = new RentalTransaction({
        userId,
        componentId: item.componentId,
        quantityRented: item.quantity,
        dueTime,
        status: 'pending'
      });
      await transaction.save();

      component.availableQuantity -= item.quantity;
      await component.save();
      
      transactions.push(transaction);
    }

    res.status(201).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user specific rentals
router.get('/rentals/user/:userId', protect, async (req, res) => {
  try {
    const rentals = await RentalTransaction.find({ userId: req.params.userId })
      .populate('componentId', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active and pending rentals (Admin Dashboard)
router.get('/rentals/active', protect, restrictTo('admin'), async (req, res) => {
  try {
    const rentals = await RentalTransaction.find({ status: { $in: ['active', 'overdue', 'pending'] } })
      .populate('userId', 'name email')
      .populate('componentId', 'name');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark item returned (Admin Dashboard)
router.post('/return/:transactionId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const transaction = await RentalTransaction.findById(transactionId);
    if (!transaction || transaction.status === 'returned') {
      return res.status(400).json({ error: 'Invalid or already returned transaction' });
    }

    transaction.status = 'returned';
    transaction.returnTime = new Date();
    await transaction.save();

    const component = await Component.findById(transaction.componentId);
    component.availableQuantity += transaction.quantityRented;
    await component.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve rental request
router.post('/rentals/:id/approve', protect, restrictTo('admin'), async (req, res) => {
  try {
    const transaction = await RentalTransaction.findById(req.params.id);
    if (!transaction || transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid transaction' });
    }
    transaction.status = 'active';
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject rental request
router.post('/rentals/:id/reject', protect, restrictTo('admin'), async (req, res) => {
  try {
    const transaction = await RentalTransaction.findById(req.params.id);
    if (!transaction || transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid transaction' });
    }
    transaction.status = 'rejected';
    await transaction.save();

    const component = await Component.findById(transaction.componentId);
    if (component) {
      component.availableQuantity += transaction.quantityRented;
      await component.save();
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get component renters
router.get('/components/:id/renters', protect, async (req, res) => {
  try {
    const rentals = await RentalTransaction.find({ 
      componentId: req.params.id, 
      status: { $in: ['active', 'overdue', 'pending'] } 
    }).populate('userId', 'name email');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lectures
router.get('/lectures', protect, async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate('requiredEquipment')
      .populate('prerequisites');
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lecture
router.post('/lectures', protect, restrictTo('admin', 'teacher'), async (req, res) => {
  try {
    const lecture = new Lecture(req.body);
    await lecture.save();
    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lecture
router.delete('/lectures/:id', protect, restrictTo('admin', 'teacher'), async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark lecture as completed for a student (verifier only)
router.post('/lectures/:id/complete', protect, restrictTo('admin', 'teacher', 'da'), async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const lectureId = req.params.id;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    if (!student.completedLectures.includes(lectureId)) {
      student.completedLectures.push(lectureId);
      await student.save();
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all student and DA users for monitoring/DA assignment
router.get('/users/students', protect, restrictTo('admin', 'teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: { $in: ['student', 'da'] } }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get eligible verifiers (admins, teachers, DAs) for dropdown list
router.get('/users/verifiers', protect, async (req, res) => {
  try {
    const verifiers = await User.find({ role: { $in: ['admin', 'teacher', 'da'] } }).select('name role');
    res.json(verifiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign DA role to a student (Must have completed all lectures)
router.post('/users/:id/assign-da', protect, restrictTo('admin', 'teacher'), async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get total number of lectures
    const totalLectures = await Lecture.countDocuments();
    
    // Check if student has completed all lectures
    if (student.completedLectures.length < totalLectures) {
      return res.status(400).json({ error: 'Student has not completed all lectures and cannot be assigned as DA.' });
    }

    student.role = 'da';
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demote DA back to student
router.post('/users/:id/demote-student', protect, restrictTo('admin', 'teacher'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'student';
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a lab completion request
router.post('/lab-requests', protect, async (req, res) => {
  try {
    const { lectureId, requestedVerifierId } = req.body;
    const studentId = req.user._id;

    // Check if lecture exists
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    // Check if student already completed it
    if (req.user.completedLectures.includes(lectureId)) {
      return res.status(400).json({ error: 'You have already completed this lab.' });
    }

    // Check if there is already a pending request
    const existingRequest = await LabCompletionRequest.findOne({ studentId, lectureId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ error: 'A pending request already exists for this lab.' });
    }

    // Check prerequisites
    if (lecture.prerequisites && lecture.prerequisites.length > 0) {
      const completedIds = req.user.completedLectures.map(id => id.toString());
      const hasPrereqs = lecture.prerequisites.every(prereqId => completedIds.includes(prereqId.toString()));
      if (!hasPrereqs) {
        return res.status(400).json({ error: 'You must complete the prerequisite lectures first.' });
      }
    }

    const request = new LabCompletionRequest({
      studentId,
      lectureId,
      requestedVerifierId: requestedVerifierId || undefined,
      status: 'pending'
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending lab verification requests for verifier queue
router.get('/lab-requests/pending', protect, restrictTo('admin', 'teacher', 'da'), async (req, res) => {
  try {
    const requests = await LabCompletionRequest.find({
      status: 'pending',
      $or: [
        { requestedVerifierId: req.user._id },
        { requestedVerifierId: { $exists: false } },
        { requestedVerifierId: null }
      ]
    })
    .populate('studentId', 'name email studentId')
    .populate('lectureId', 'title')
    .sort({ createdAt: 1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current student's requests
router.get('/lab-requests/my-requests', protect, async (req, res) => {
  try {
    const requests = await LabCompletionRequest.find({ studentId: req.user._id })
      .populate('actionedBy', 'name role')
      .populate('requestedVerifierId', 'name role')
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject lab completion request
router.post('/lab-requests/:id/action', protect, restrictTo('admin', 'teacher', 'da'), async (req, res) => {
  try {
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'
    const request = await LabCompletionRequest.findById(req.params.id);
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already processed request' });
    }

    if (action === 'approve') {
      request.status = 'approved';
      request.actionedBy = req.user._id;
      await request.save();

      // Update student's completedLectures
      const student = await User.findById(request.studentId);
      if (student && !student.completedLectures.includes(request.lectureId)) {
        student.completedLectures.push(request.lectureId);
        await student.save();
      }
    } else if (action === 'reject') {
      request.status = 'rejected';
      request.actionedBy = req.user._id;
      request.rejectionReason = rejectionReason || 'Reverification required. Please perform the lab once again.';
      await request.save();
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
