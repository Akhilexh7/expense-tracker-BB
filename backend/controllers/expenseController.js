const Expense = require('../models/Expense');

// Enhanced categorization function with better income detection
const categorizeTransaction = (description, type) => {
  if (type === 'income') return 'income';
  
  const categoryMap = {
    groceries: ['grocery', 'supermarket', 'aldi', 'whole foods', 'walmart', 'target', 'bigbasket', 'dmart'],
    transport: ['uber', 'bus', 'train', 'gas', 'lyft', 'taxi', 'subway', 'ola', 'rapido', 'auto', 'petrol'],
    food: ['restaurant', 'lunch', 'dinner', 'cafe', 'coffee', 'starbucks', 'mcdonalds', 'zomato', 'swiggy', 'pizza', 'burger'],
    entertainment: ['movie', 'netflix', 'concert', 'game', 'spotify', 'hotstar', 'prime video', 'youtube premium'],
    utilities: ['electric', 'water', 'internet', 'phone', 'wifi', 'broadband', 'mobile recharge', 'bill'],
    shopping: ['clothes', 'amazon', 'flipkart', 'myntra', 'mall', 'store', 'shopping', 'purchase'],
    healthcare: ['hospital', 'doctor', 'medicine', 'medical', 'pharmacy', 'apollo'],
    education: ['books', 'course', 'tuition', 'school', 'college', 'training'],
    income: ['salary', 'freelance', 'bonus', 'investment', 'refund', 'payment received', 'earned', 'income']
  };

  const text = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(word => text.includes(word))) {
      return category;
    }
  }
  return 'other';
};

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category, type, date } = req.body;
    
    // Auto-detect type based on description if not provided
    let finalType = type;
    if (!finalType) {
      const incomeKeywords = ['salary', 'income', 'received', 'got', 'earned', 'bonus', 'payment', 'refund'];
      const isIncome = incomeKeywords.some(keyword => description.toLowerCase().includes(keyword));
      finalType = isIncome ? 'income' : 'expense';
    }
    
    // Auto-categorize if no category provided
    const finalCategory = category || categorizeTransaction(description, finalType);
    
    const expense = new Expense({
      user: req.user.userId,
      amount: parseFloat(amount),
      description,
      category: finalCategory,
      type: finalType,
      date: date || new Date()
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.userId });
    
    if (!expense) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};