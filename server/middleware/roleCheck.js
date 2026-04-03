const checkRole = (authorizedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'No user found, authorization denied' });
    }

    if (!authorizedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        msg: `Access denied: role "${req.user.role}" cannot perform this action`,
      });
    }

    next();
  };
};

module.exports = checkRole;
