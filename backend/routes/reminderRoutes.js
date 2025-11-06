const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Reminder = require('../models/Reminder');

// Get user's reminders
router.get('/', verifyToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.userId }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new reminder
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, dueDate, category } = req.body;
    
    const reminder = new Reminder({
      user: req.user.userId,
      title,
      dueDate,
      category
    });
    
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update reminder
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, dueDate, category, isCompleted } = req.body;
    
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.userId });
    
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    
    if (title !== undefined) reminder.title = title;
    if (dueDate !== undefined) reminder.dueDate = dueDate;
    if (category !== undefined) reminder.category = category;
    if (isCompleted !== undefined) reminder.isCompleted = isCompleted;
    
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete reminder
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.userId });
    
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;