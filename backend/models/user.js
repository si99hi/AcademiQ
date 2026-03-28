import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationOtp: { type: String },
  verificationOtpExpire: { type: Date },
  resetPasswordOtp: { type: String },
  resetPasswordExpire: { type: Date }
});

const User = mongoose.model('User', userSchema);

export default User;