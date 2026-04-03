const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  defaultCurrency: { 
    type: String, 
    default: 'INR'
  } 
});

module.exports = mongoose.model('Company', CompanySchema);