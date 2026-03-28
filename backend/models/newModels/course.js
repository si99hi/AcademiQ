import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['quiz', 'assignment', 'exam'], required: true },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'essay', 'coding'], required: true },
    options: [{ type: String }], // For multiple choice questions
    correctAnswer: { type: mongoose.Schema.Mixed }, // Can be string, array, or object based on question type
    points: { type: Number, default: 1 }
  }],
  timeLimit: { type: Number }, // in minutes
  passingScore: { type: Number, required: true },
  dueDate: { type: Date },
  isActive: { type: Boolean, default: true }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'document', 'interactive', 'live-session'], required: true },
    content: { type: String, required: true }, // URL or content body
    duration: { type: Number }, // in minutes
    isRequired: { type: Boolean, default: true }
  }],
  resources: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'link', 'code'], required: true },
    url: { type: String, required: true },
    description: { type: String }
  }],
  assessment: { type: assessmentSchema },
  order: { type: Number, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  isPublished: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coInstructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subject: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  learningOutcomes: [{ type: String }],
  modules: [moduleSchema],
  duration: { type: Number }, // total duration in hours
  schedule: {
    startDate: { type: Date },
    endDate: { type: Date },
    sessions: [{
      date: { type: Date },
      duration: { type: Number }, // in minutes
      topic: { type: String },
      type: { type: String, enum: ['lecture', 'workshop', 'qa-session'] }
    }]
  },
  pricing: {
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    discountPrice: { type: Number },
    discountEndDate: { type: Date }
  },
  enrollmentLimit: { type: Number },
  enrollmentCount: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      review: { type: String },
      date: { type: Date, default: Date.now }
    }]
  },
  certificate: {
    enabled: { type: Boolean, default: false },
    template: { type: String }, // URL to certificate template
    requirements: {
      minProgress: { type: Number, default: 100 }, // minimum progress percentage
      minGrade: { type: Number, default: 70 } // minimum grade percentage
    }
  },
  analytics: {
    totalCompletions: { type: Number, default: 0 },
    averageCompletionTime: { type: Number }, // in days
    dropoutRate: { type: Number, default: 0 }
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  next();
});

// Method to calculate course progress for a student
courseSchema.methods.calculateProgress = function(completedModules) {
  const totalModules = this.modules.length;
  const completed = completedModules.length;
  return (completed / totalModules) * 100;
};

// Method to check if course is full
courseSchema.methods.isFull = function() {
  return this.enrollmentLimit && this.enrollmentCount >= this.enrollmentLimit;
};

// Method to add a review
courseSchema.methods.addReview = function(userId, rating, review) {
  this.rating.reviews.push({ user: userId, rating, review });
  const totalRating = this.rating.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating.average = totalRating / this.rating.reviews.length;
  this.rating.count = this.rating.reviews.length;
  return this.save();
};

const Course = mongoose.model('Course', courseSchema);

export default Course;