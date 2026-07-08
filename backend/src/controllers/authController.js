const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Hardcoded default users as fallback when database is offline
const mockUsers = [
  { _id: 'mock_admin_id', email: 'admin@buildtrack.com', password: 'admin123', role: 'Administrator', profile: { firstName: 'Alice', lastName: 'Admin', phone: '1234567890' } },
  { _id: 'mock_pm_id', email: 'pm@buildtrack.com', password: 'pm123', role: 'Project_Manager', profile: { firstName: 'Bob', lastName: 'Manager', phone: '1234567891' } },
  { _id: 'mock_engineer_id', email: 'engineer@buildtrack.com', password: 'engineer123', role: 'Site_Engineer', profile: { firstName: 'Charlie', lastName: 'Engineer', phone: '1234567892' } },
  { _id: 'mock_contractor_id', email: 'contractor@buildtrack.com', password: 'contractor123', role: 'Contractor', profile: { firstName: 'David', lastName: 'Contractor', phone: '1234567893' } },
  { _id: 'mock_client_id', email: 'client@buildtrack.com', password: 'client123', role: 'Client', profile: { firstName: 'Emma', lastName: 'Client', phone: '1234567894' } },
  { _id: 'mock_worker_id', email: 'worker@buildtrack.com', password: 'worker123', role: 'Worker', profile: { firstName: 'Frank', lastName: 'Worker', phone: '1234567895' } }
];

// Login User
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // --- OFFLINE MOCK MODE CHECK ---
    if (mongoose.connection.readyState !== 1) {
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (!mockUser) {
        return res.status(401).json({ message: 'Invalid credentials (Mock Offline Mode)' });
      }
      
      const token = jwt.sign(
        { _id: mockUser._id, role: mockUser.role, email: mockUser.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.status(200).json({
        token,
        user: {
          _id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
          profile: mockUser.profile
        }
      });
    }

    // --- NORMAL DATABASE MODE ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Invite/Create User (Administrator Only)
async function inviteUser(req, res) {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role || !profile) {
      return res.status(400).json({ message: 'Email, password, role, and profile are required' });
    }

    // --- OFFLINE MOCK MODE CHECK ---
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        message: 'User created successfully (Mock Offline Mode)',
        user: {
          _id: 'mock_invited_' + Date.now(),
          email,
          role,
          profile
        }
      });
    }

    // --- NORMAL DATABASE MODE ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const validRoles = ['Administrator', 'Project_Manager', 'Site_Engineer', 'Contractor', 'Worker', 'Client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password_hash,
      role,
      profile
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Register User (Public Registration)
async function register(req, res) {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role || !profile) {
      return res.status(400).json({ message: 'Email, password, role, and profile are required' });
    }

    // --- OFFLINE MOCK MODE CHECK ---
    if (mongoose.connection.readyState !== 1) {
      const existingMock = mockUsers.find(u => u.email === email);
      if (existingMock) {
        return res.status(409).json({ message: 'User already exists (Mock Offline Mode)' });
      }

      const newMockUser = {
        _id: 'mock_registered_' + Date.now(),
        email,
        password,
        role,
        profile
      };
      mockUsers.push(newMockUser);

      return res.status(201).json({
        message: 'Registration successful (Mock Offline Mode)',
        user: {
          _id: newMockUser._id,
          email: newMockUser.email,
          role: newMockUser.role,
          profile: newMockUser.profile
        }
      });
    }

    // --- NORMAL DATABASE MODE ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const validRoles = ['Administrator', 'Project_Manager', 'Site_Engineer', 'Contractor', 'Worker', 'Client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password_hash,
      role,
      profile
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  login,
  inviteUser,
  register
};
