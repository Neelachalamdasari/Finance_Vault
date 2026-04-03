const mongoose = require('mongoose');
function toCompanyObjectId(company) {
  if (company == null) return null;

  
  try {
    return new mongoose.Types.ObjectId(String(company));
  } catch {
    return null;
  }
}

function requireCompany(res, companyId) {
  if (!companyId) {
    res.status(400).json({
      success: false,
      msg: 'User is not associated with an organization. Complete signup or contact support.',
    });
    return false;
  }
  return true;
}

module.exports = { toCompanyObjectId, requireCompany };
