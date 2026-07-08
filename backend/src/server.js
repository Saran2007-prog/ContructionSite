const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildtrack';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BuildTrack Construction Site Monitoring RBAC API Gateway' });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Seed function for development convenience
async function seedDefaultUsers() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has users. Skipping seeding.');
      return;
    }

    console.log('Seeding default users...');
    const defaultUsers = [
      { email: 'admin@buildtrack.com', password: 'admin123', role: 'Administrator', profile: { firstName: 'Alice', lastName: 'Admin', phone: '1234567890' } },
      { email: 'pm@buildtrack.com', password: 'pm123', role: 'Project_Manager', profile: { firstName: 'Bob', lastName: 'Manager', phone: '1234567891' } },
      { email: 'engineer@buildtrack.com', password: 'engineer123', role: 'Site_Engineer', profile: { firstName: 'Charlie', lastName: 'Engineer', phone: '1234567892' } },
      { email: 'contractor@buildtrack.com', password: 'contractor123', role: 'Contractor', profile: { firstName: 'David', lastName: 'Contractor', phone: '1234567893' } },
      { email: 'client@buildtrack.com', password: 'client123', role: 'Client', profile: { firstName: 'Emma', lastName: 'Client', phone: '1234567894' } },
      { email: 'worker@buildtrack.com', password: 'worker123', role: 'Worker', profile: { firstName: 'Frank', lastName: 'Worker', phone: '1234567895' } }
    ];

    for (const u of defaultUsers) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(u.password, salt);
      const newUser = new User({
        email: u.email,
        password_hash,
        role: u.role,
        profile: u.profile
      });
      await newUser.save();
      console.log(`Seeded user: ${u.email} (${u.role})`);
    }
    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding default users:', err);
  }
}

// Connect to MongoDB & Start Server
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected successfully to MongoDB at:', MONGODB_URI);
    await seedDefaultUsers();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    console.log('Starting Express server without database connection for mock/offline testing...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (Offline/Mock Mode)`);
    });
  });
