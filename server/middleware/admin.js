module.exports = function (req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, msg: 'Access denied. Not an admin.' });
  }
  next();
};