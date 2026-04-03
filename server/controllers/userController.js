const User = require('../models/User');
const bcrypt = require('bcryptjs');

const ROLES = ['Admin', 'Analyst', 'Viewer'];
const STATUSES = ['Active', 'Inactive'];

function normalizeRole(input) {
  if (input == null) return null;
  const s = String(input).trim().toLowerCase();
  if (s === 'admin') return 'Admin';
  if (s === 'analyst') return 'Analyst';
  if (s === 'viewer') return 'Viewer';
  return null;
}

function normalizeStatus(input) {
  if (input == null) return null;
  const s = String(input).trim().toLowerCase();
  if (s === 'active') return 'Active';
  if (s === 'inactive') return 'Inactive';
  return null;
}

function sameCompany(userDoc, adminCompanyId) {
  if (!userDoc.company || !adminCompanyId) return false;
  return userDoc.company.toString() === adminCompanyId.toString();
}


exports.createUser = async (req, res) => {
  const { name, email, password, role, status } = req.body;
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Not an admin.' });
    }

    if (!req.user.company) {
      return res.status(400).json({
        success: false,
        msg: 'Admin must belong to an organization to create users.',
      });
    }
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide name, email, and password',
      });
    }


    const normalizedRole =
      role == null || String(role).trim() === '' ? 'Viewer' : normalizeRole(role);
    if (!normalizedRole) {
      return res.status(400).json({
        success: false,
        msg: `role must be one of: ${ROLES.join(', ')}`,
      });
    }

    const normalizedStatus =
      status == null || String(status).trim() === '' ? 'Active' : normalizeStatus(status);
    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        msg: `status must be one of: ${STATUSES.join(', ')}`,
      });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, msg: 'User already exists' });

    user = new User({
      name,
      email,
      password,
      role: normalizedRole,
      status: normalizedStatus,
      company: req.user.company,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Not an admin.' });
    }

    const normalizedStatus =
      status == null || String(status).trim() === '' ? null : normalizeStatus(status);
    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        msg: `status must be one of: ${STATUSES.join(', ')}`,
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    if (!sameCompany(user, req.user.company)) {
      return res.status(403).json({ success: false, msg: 'Not authorized for this user' });
    }

    user.status = normalizedStatus;
    await user.save();

    const updated = await User.findById(user._id).select('-password');
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  const { name, role, status } = req.body;
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, msg: 'Access denied. Not an admin.' });
    }

    const roleProvided = role !== undefined;
    const statusProvided = status !== undefined;

    const normalizedRole =
      roleProvided && role != null && String(role).trim() !== '' ? normalizeRole(role) : undefined;
    if (roleProvided && role != null && String(role).trim() !== '' && !normalizedRole) {
      return res.status(400).json({
        success: false,
        msg: `role must be one of: ${ROLES.join(', ')}`,
      });
    }

    const normalizedStatus =
      statusProvided && status != null && String(status).trim() !== '' ? normalizeStatus(status) : undefined;
    if (statusProvided && status != null && String(status).trim() !== '' && !normalizedStatus) {
      return res.status(400).json({
        success: false,
        msg: `status must be one of: ${STATUSES.join(', ')}`,
      });
    }
    if (name === undefined && roleProvided === false && statusProvided === false) {
      return res.status(400).json({
        success: false,
        msg: 'Provide at least one of: name, role, status',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    if (!sameCompany(user, req.user.company)) {
      return res.status(403).json({ success: false, msg: 'Not authorized for this user' });
    }

    if (name !== undefined) user.name = name;
    if (roleProvided && role != null && String(role).trim() !== '') user.role = normalizedRole;
    if (statusProvided && status != null && String(status).trim() !== '') user.status = normalizedStatus;

    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};



exports.getAdminDirectory = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
