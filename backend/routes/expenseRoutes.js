const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const expenseController = require('../controllers/expenseController');

router.get('/', verifyToken, expenseController.getExpenses);
router.post('/', verifyToken, expenseController.addExpense);
router.delete('/:id', verifyToken, expenseController.deleteExpense);

module.exports = router;