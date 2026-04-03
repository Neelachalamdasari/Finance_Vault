const Transaction = require('../models/Transaction');
const { toCompanyObjectId, requireCompany } = require('../utils/companyScope');
exports.getDashboardSummary = async (req, res) => {
  try {
    if (!requireCompany(res, req.user.company)) return;

    const companyId = toCompanyObjectId(req.user.company);
    const match = { company: companyId };

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 6);

    const [totalsAgg, categoryAgg, recent, monthlyTrend, weeklyTrend] = await Promise.all([
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: { $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0] },
            },
            totalExpenses: {
              $sum: { $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0] },
            },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: { category: '$category', type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Transaction.find(match)
        .sort({ date: -1 })
        .limit(10)
        .select('amount type category date description createdAt')
        .lean(),
      Transaction.aggregate([
        { $match: { ...match, date: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            income: {
              $sum: { $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0] },
            },
            expenses: {
              $sum: { $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0] },
            },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Transaction.aggregate([
        { $match: { ...match, date: { $gte: startOfWeek } } },
        {
          $group: {
            _id: { $dayOfWeek: '$date' },
            income: {
              $sum: { $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0] },
            },
            expenses: {
              $sum: { $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totals = totalsAgg[0] || { totalIncome: 0, totalExpenses: 0 };
    const totalIncome = totals.totalIncome || 0;
    const totalExpenses = totals.totalExpenses || 0;

    const categoryTotals = categoryAgg.map((row) => ({
      category: row._id.category,
      type: row._id.type,
      total: row.total,
    }));

    const monthlyTrends = monthlyTrend.map((row) => ({
      period: `${row._id.year}-${String(row._id.month).padStart(2, '0')}`,
      income: row.income,
      expenses: row.expenses,
      net: row.income - row.expenses,
    }));

    const weeklyTrends = weeklyTrend.map((row) => ({
      dayOfWeek: row._id,
      income: row.income,
      expenses: row.expenses,
      net: row.income - row.expenses,
    }));

    const payload = {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryTotals,
      recentActivity: recent,
      monthlyTrends,
      weeklyTrends,
    };

    if (req.user.role === 'Viewer') {
      const { recentActivity, ...rest } = payload;
      return res.json({ success: true, data: { ...rest, recentActivity: [] } });
    }

    res.json({ success: true, data: payload });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
