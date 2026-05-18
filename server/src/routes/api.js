const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const RentalTransaction = require('../models/RentalTransaction');

const User = require('../models/User');

// Simple Login (No JWT for simplicity as requested, just returning user)
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all components (Student Catalog)
router.get('/components', async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new component (Admin Upload)
router.post('/components', async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout items (Cart)
router.post('/checkout', async (req, res) => {
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
        status: 'active'
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
router.get('/rentals/user/:userId', async (req, res) => {
  try {
    const rentals = await RentalTransaction.find({ userId: req.params.userId })
      .populate('componentId', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active rentals (Admin Dashboard)
router.get('/rentals/active', async (req, res) => {
  try {
    const rentals = await RentalTransaction.find({ status: { $in: ['active', 'overdue'] } })
      .populate('userId', 'name email')
      .populate('componentId', 'name');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark item returned (Admin Dashboard)
router.post('/return/:transactionId', async (req, res) => {
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

module.exports = router;
