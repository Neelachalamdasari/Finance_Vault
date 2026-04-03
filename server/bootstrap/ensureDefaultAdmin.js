const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');

function normalizeRole(input) {
  if (input == null) return null;
  const s = String(input).trim().toLowerCase();
  if (s === 'admin') return 'Admin';
  if (s === 'analyst') return 'Analyst';
  if (s === 'viewer') return 'Viewer';
  return null;
}

async function ensureDefaultAdmin() {
 
  const existingAdmin = await User.findOne({ role: 'Admin' });
  if (existingAdmin) return { created: false };

  const companyName = process.env.DEFAULT_ADMIN_COMPANY_NAME || 'Default Company';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Default Admin';
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin12345';

  
  let company = await Company.findOne({ name: companyName });
  if (!company) {
    company = await Company.create({ name: companyName });
  }

  const role = normalizeRole('Admin');
  const hashed = await bcrypt.hash(adminPassword, await bcrypt.genSalt(10));

  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashed,
    company: company._id,
    role,
    status: 'Active',
  });

  
  console.log(
    `[bootstrap] Default admin created: email=${adminEmail} company=${companyName}`
  );
  return { created: true };
}

module.exports = ensureDefaultAdmin;

