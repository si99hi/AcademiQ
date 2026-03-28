import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  modules: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    resources: [{
      title: { type: String, required: true },
      type: { type: String, enum: ['video', 'document', 'quiz'], required: true },
      url: { type: String, required: true }
    }],
    order: { type: Number, required: true }
  }],
  enrollmentCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;