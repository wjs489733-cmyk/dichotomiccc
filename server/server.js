const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // 개발 환경에서 모든 origin 허용
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/selected-works', require('./routes/selected-works'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dichotomiccc API Server is running',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  initializeAdmin();
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Initialize default admin user
async function initializeAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const admin = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Default admin user created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
      console.log('   ⚠️  Please change the password after first login!');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});


