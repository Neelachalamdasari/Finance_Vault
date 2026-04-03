require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ensureDefaultAdmin = require('./bootstrap/ensureDefaultAdmin');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transaction'));
app.use('/api/dashboard', require('./routes/dashboard')); 

app.use('/api/analytics', require('./routes/analytics')); 
app.use((req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, msg: 'Internal Server Error' });
});
async function start() {
  try {
    await connectDB();
    await ensureDefaultAdmin();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }


}
start();