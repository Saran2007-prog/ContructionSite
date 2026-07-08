const mongoose = require('mongoose');

// Project Schema
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

// Milestone Schema
const MilestoneSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'In_Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date }
}, { timestamps: true });

// Resource Schema
const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Equipment, Material
  quantity: { type: Number, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

// Inventory Schema
const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  sku: { type: String, unique: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true } // e.g., bags, tons
}, { timestamps: true });

// Worker Schema
const WorkerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  hourlyRate: { type: Number },
  status: { type: String, enum: ['Available', 'Assigned', 'On_Leave'], default: 'Available' }
}, { timestamps: true });

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Procurement Schema
const ProcurementSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Report Schema
const ReportSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Daily', 'Weekly', 'Safety', 'Financial'], required: true },
  content: { type: String }
}, { timestamps: true });

module.exports = {
  Project: mongoose.model('Project', ProjectSchema),
  Milestone: mongoose.model('Milestone', MilestoneSchema),
  Resource: mongoose.model('Resource', ResourceSchema),
  Inventory: mongoose.model('Inventory', InventorySchema),
  Worker: mongoose.model('Worker', WorkerSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Procurement: mongoose.model('Procurement', ProcurementSchema),
  Notification: mongoose.model('Notification', NotificationSchema),
  Report: mongoose.model('Report', ReportSchema)
};
