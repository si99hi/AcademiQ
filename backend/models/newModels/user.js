import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    progress: { type: Number, default: 0 },
    lastAccessed: { type: Date },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
    grade: { type: Number },
    certificateIssued: { type: Boolean, default: false }
  }],
  achievements: [{
    title: { type: String, required: true },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now },
    badge: { type: String } // URL to badge image
  }],
  notifications: [{
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    timezone: { type: String },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  accountStatus: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user has completed a course
userSchema.methods.hasCompletedCourse = function(courseId) {
  const enrolledCourse = this.enrolledCourses.find(ec => ec.course.toString() === courseId.toString());
  return enrolledCourse && enrolledCourse.progress === 100;
};

// Method to add achievement
userSchema.methods.addAchievement = function(achievement) {
  this.achievements.push(achievement);
  return this.save();
};

// Method to mark notification as read
userSchema.methods.markNotificationAsRead = function(notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.read = true;
    return this.save();
  }
  return Promise.reject(new Error('Notification not found'));
};

const User = mongoose.model('User', userSchema);

export default User;