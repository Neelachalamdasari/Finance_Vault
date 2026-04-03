const User = require('../models/User');
exports.getAdminSummary = async (req, res) => {
  try {
    const company = req.user.company;
    const [viewerCount, analystCount, adminCount, activeCount, inactiveCount] =
      await Promise.all([
        User.countDocuments({ company, role: 'Viewer' }),
        User.countDocuments({ company, role: 'Analyst' }),
        User.countDocuments({ company, role: 'Admin' }),
        User.countDocuments({ company, status: 'Active' }),
        User.countDocuments({ company, status: 'Inactive' }),
      ]);

    res.json({
      success: true,
      data: {
        byRole: { Viewer: viewerCount, Analyst: analystCount, Admin: adminCount },
        byStatus: { Active: activeCount, Inactive: inactiveCount },
        totalUsers: viewerCount + analystCount + adminCount,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


exports.getManagerSummary = async (req, res) => {
  try {
    const subordinateCount = await User.countDocuments({
      manager: req.user.id,
      company: req.user.company,
    });
    res.json({
      success: true,
      data: { subordinateCount },
      note: 'Optional hierarchy field; main roles are Viewer / Analyst / Admin.',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
