const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
exports.getDashboardSummary = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.company);
    
    const summary = await Transaction.aggregate([
      { $match: { company: companyId } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] }
          },
          
          categories: {
            $push: { category: "$category", amount: "$amount", type: "$type" }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] },
          recentActivity: { $slice: ["$categories", -10] }
        }
      }
    ]);

    const result = summary.length > 0 ? summary[0] : { totalIncome: 0, totalExpenses: 0, netBalance: 0, recentActivity: [] };
    

    if (req.user.role === 'Viewer') {
      result.recentActivity = []; 
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { company: req.user.company };
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = { $regex: req.query.category, $options: 'i' };

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query)
    ]);

    res.json({ 
      success: true, 
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const transaction = new Transaction({
      amount, type, category, date, description,
      user: req.user.id,
      company: req.user.company
    });
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};


exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Record not found' });


    if (transaction.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};


exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Record not found' });

    if (transaction.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ success: true, msg: 'Record removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
