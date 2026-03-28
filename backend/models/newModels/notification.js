import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'course_announcement',
      'assignment_due',
      'grade_posted',
      'discussion_reply',
      'course_reminder',
      'achievement_earned',
      'enrollment_confirmation',
      'course_completion',
      'system_alert'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    achievement: {
      title: { type: String },
      badge: { type: String }
    }
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: {
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    clicked: { type: Boolean, default: false },
    clickedAt: { type: Date }
  },
  delivery: {
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ 'status.read': 1, recipient: 1 });

// Pre-save middleware to set expiration
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set default expiration to 30 days from creation
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.status.read = true;
  this.status.readAt = new Date();
  return this.save();
};

// Method to mark notification as clicked
notificationSchema.methods.markAsClicked = function() {
  this.status.clicked = true;
  this.status.clickedAt = new Date();
  return this.save();
};

// Static method to create course announcement notification
notificationSchema.statics.createCourseAnnouncement = function(recipientId, courseId, title, message) {
  return this.create({
    recipient: recipientId,
    type: 'course_announcement',
    title,
    message,
    data: { course: courseId },
    priority: 'medium',
    delivery: { email: true, push: true, inApp: true }
  });
};

// Static method to create assignment due notification
notificationSchema.statics.createAssignmentDue = function(recipientId, assessmentId, title, message) {
  return this.create({
    recipient: recipientId,
    type: 'assignment_due',
    title,
    message,
    data: { assessment: assessmentId },
    priority: 'high',
    delivery: { email: true, push: true, inApp: true }
  });
};

// Static method to create achievement notification
notificationSchema.statics.createAchievementEarned = function(recipientId, achievementData, message) {
  return this.create({
    recipient: recipientId,
    type: 'achievement_earned',
    title: 'New Achievement Earned!',
    message,
    data: { achievement: achievementData },
    priority: 'medium',
    delivery: { email: false, push: true, inApp: true }
  });
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    'status.read': false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;