const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Budget = require('../models/Budget');

// Get user's budget
router.get('/', verifyToken, async (req, res) => {
  try {
    let budget = await Budget.findOne({ user: req.user.userId });
    
    if (!budget) {
      // Create default budget if none exists
      budget = new Budget({
        user: req.user.userId,
        categories: [
          { name: 'food', amount: 300 },
          { name: 'groceries', amount: 400 },
          { name: 'transport', amount: 200 },
          { name: 'entertainment', amount: 100 },
          { name: 'utilities', amount: 150 },
          { name: 'shopping', amount: 200 },
          { name: 'other', amount: 100 }
        ]
      });
      await budget.save();
    }
    
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user's budget
router.post('/', verifyToken, async (req, res) => {
  try {
    const { categories } = req.body;
    
    let budget = await Budget.findOne({ user: req.user.userId });
    
    if (budget) {
      budget.categories = categories;
      await budget.save();
    } else {
      budget = new Budget({
        user: req.user.userId,
        categories
      });
      await budget.save();
    }
    
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;