import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['course', 'assignment', 'exam', 'workshop', 'announcement'], required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['online', 'physical', 'hybrid'] },
    url: { type: String }, // For online events
    venue: { type: String }, // For physical events
    meetingId: { type: String } // For virtual meetings
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    pattern: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    endDate: { type: Date }
  },
  reminders: [{
    time: { type: Date },
    type: { type: String, enum: ['email', 'notification'] },
    sent: { type: Boolean, default: false }
  }],
  attachments: [{
    name: { type: String },
    url: { type: String },
    type: { type: String }
  }],
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], default: 'scheduled' },
  attendance: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent', 'late'] },
    joinTime: { type: Date },
    leaveTime: { type: Date }
  }],
  feedback: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Pre-save middleware to update timestamps
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if event is ongoing
eventSchema.methods.isOngoing = function() {
  const now = new Date();
  return now >= this.start && now <= this.end;
};

// Method to mark attendance
eventSchema.methods.markAttendance = function(userId, status) {
  const attendanceRecord = this.attendance.find(a => a.user.toString() === userId.toString());
  if (attendanceRecord) {
    attendanceRecord.status = status;
    if (status === 'present') {
      attendanceRecord.joinTime = new Date();
    } else if (status === 'absent') {
      attendanceRecord.leaveTime = new Date();
    }
  } else {
    this.attendance.push({
      user: userId,
      status,
      joinTime: status === 'present' ? new Date() : null
    });
  }
  return this.save();
};

// Method to add feedback
eventSchema.methods.addFeedback = function(userId, rating, comment) {
  this.feedback.push({ user: userId, rating, comment });
  return this.save();
};

// Method to get attendance statistics
eventSchema.methods.getAttendanceStats = function() {
  const total = this.attendance.length;
  const present = this.attendance.filter(a => a.status === 'present').length;
  const absent = this.attendance.filter(a => a.status === 'absent').length;
  const late = this.attendance.filter(a => a.status === 'late').length;
  
  return {
    total,
    present,
    absent,
    late,
    attendanceRate: total > 0 ? (present / total) * 100 : 0
  };
};

const Event = mongoose.model('Event', eventSchema);

export default Event;