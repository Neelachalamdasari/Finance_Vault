const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await User.findById(req.user.id).select('status');
    if (!user) {
      return res.status(401).json({ success: false, msg: 'User no longer exists' });
    }
    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        msg: 'Account is inactive. Contact your administrator.',
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Token is not valid' });
  }
};
