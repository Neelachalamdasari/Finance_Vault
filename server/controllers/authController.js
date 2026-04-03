const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide name, email, and password',
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    
    const defaultCompanyName =
      process.env.DEFAULT_ADMIN_COMPANY_NAME || 'Default Company';


    let company = await Company.findOne({ name: defaultCompanyName });
    if (!company) {
      company = await Company.create({ name: defaultCompanyName });
    }

    
    user = new User({
      name,
      email,
      password,
      company: company._id,
      role: 'Viewer',
      status: 'Active',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        company: user.company,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (user.status === 'Inactive') {
            return res.status(403).json({
                success: false,
                msg: 'Account is inactive. Contact your administrator.',
            });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                company: user.company
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getMe = async (req, res) => {
    try {
        // Find user by ID from the token, populate company and manager details
        const user = await User.findById(req.user.id)
            .select('-password') // Exclude the password for security
            .populate('company', 'name defaultCurrency') // Get company name and currency
            .populate('manager', 'name'); // Get manager's name

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};