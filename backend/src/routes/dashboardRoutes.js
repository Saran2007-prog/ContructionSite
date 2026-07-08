const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Helper to send standard responses
const createMockResponse = (roleName, data) => (req, res) => {
  res.json({
    success: true,
    message: `Successfully verified access for role: ${req.user.role}`,
    user: req.user,
    data: data
  });
};

// Admin Dashboard Data
router.get('/admin', authenticateToken, authorizeRole(['Administrator']), createMockResponse('Administrator', {
  stats: { totalUsers: 15, activeSites: 4, pendingProcurements: 8 },
  recentLogs: [
    { timestamp: new Date(), action: 'User Created', details: 'Contractor user added' },
    { timestamp: new Date(), action: 'System Update', details: 'RBAC parameters verified' }
  ]
}));

// PM Dashboard Data
router.get('/pm', authenticateToken, authorizeRole(['Administrator', 'Project_Manager']), createMockResponse('Project Manager', {
  projects: [
    { id: 'p1', name: 'Downtown Plaza', status: 'In Progress', budget: '$1.2M', progress: 65 },
    { id: 'p2', name: 'Westside Residential', status: 'Planning', budget: '$850K', progress: 10 }
  ],
  milestones: [
    { id: 'm1', project: 'Downtown Plaza', title: 'Foundation Concrete Pour', status: 'Completed' },
    { id: 'm2', project: 'Downtown Plaza', title: 'Structural Framing', status: 'In_Progress' }
  ]
}));

// Engineer Dashboard Data
router.get('/engineer', authenticateToken, authorizeRole(['Administrator', 'Site_Engineer']), createMockResponse('Site Engineer', {
  siteLogs: [
    { date: '2026-07-07', site: 'Downtown Plaza', tasksDone: 'Framing inspection, concrete curing verification', remarks: 'Good progress' }
  ],
  safetyCheck: { status: 'Compliant', lastChecked: new Date() }
}));

// Contractor Dashboard Data
router.get('/contractor', authenticateToken, authorizeRole(['Administrator', 'Contractor']), createMockResponse('Contractor', {
  assignedTasks: [
    { task: 'Electrical Wiring Stage 2', deadline: '2026-07-15', workersAssigned: 4 },
    { task: 'HVAC Duct Installation', deadline: '2026-07-20', workersAssigned: 3 }
  ],
  inventoryRequests: [
    { item: 'Copper Wire 12AWG', qty: '500m', status: 'Approved' }
  ]
}));

// Client Dashboard Data
router.get('/client', authenticateToken, authorizeRole(['Administrator', 'Client']), createMockResponse('Client', {
  projectProgress: { name: 'Westside Residential', overallCompletion: 12, billingStatus: 'Up to Date' },
  updates: [
    { date: '2026-07-06', update: 'Architectural blueprints approved by local authority' }
  ]
}));

// Worker Dashboard Data
router.get('/worker', authenticateToken, authorizeRole(['Administrator', 'Worker']), createMockResponse('Worker', {
  shiftSchedule: [
    { date: '2026-07-08', shift: '08:00 AM - 05:00 PM', location: 'Zone C - Downtown Plaza' }
  ],
  attendanceStatus: { presentDays: 18, absentDays: 1, leaveDays: 0 }
}));

module.exports = router;
