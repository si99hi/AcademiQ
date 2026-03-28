import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: mongoose.Schema.Mixed },
    isCorrect: { type: Boolean },
    score: { type: Number },
    feedback: { type: String }
  }],
  startTime: { type: Date, default: Date.now },
  submitTime: { type: Date },
  timeSpent: { type: Number }, // in minutes
  totalScore: { type: Number },
  status: { type: String, enum: ['in-progress', 'submitted', 'graded'], default: 'in-progress' },
  attempts: { type: Number, default: 1 },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date }
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  type: { type: String, enum: ['quiz', 'assignment', 'exam', 'project'], required: true },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'essay', 'coding', 'file-upload'], required: true },
    options: [{
      text: { type: String },
      isCorrect: { type: Boolean }
    }],
    correctAnswer: { type: mongoose.Schema.Mixed },
    points: { type: Number, default: 1 },
    rubric: [{
      criterion: { type: String },
      points: { type: Number },
      description: { type: String }
    }]
  }],
  settings: {
    timeLimit: { type: Number }, // in minutes
    passingScore: { type: Number, required: true },
    maxAttempts: { type: Number, default: 1 },
    shuffleQuestions: { type: Boolean, default: false },
    showResults: { type: Boolean, default: true },
    showFeedback: { type: Boolean, default: true },
    allowReview: { type: Boolean, default: true }
  },
  schedule: {
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    lateSubmission: {
      allowed: { type: Boolean, default: false },
      deadline: { type: Date },
      penaltyPerDay: { type: Number } // percentage
    }
  },
  submissions: [submissionSchema],
  statistics: {
    averageScore: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    lowestScore: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 }
  },
  visibility: {
    isPublished: { type: Boolean, default: false },
    publishDate: { type: Date },
    hideAfterCompletion: { type: Boolean, default: false }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate statistics
assessmentSchema.methods.calculateStatistics = function() {
  const scores = this.submissions
    .filter(s => s.status === 'graded')
    .map(s => s.totalScore);

  if (scores.length > 0) {
    this.statistics.averageScore = scores.reduce((a, b) => a + b) / scores.length;
    this.statistics.highestScore = Math.max(...scores);
    this.statistics.lowestScore = Math.min(...scores);
    this.statistics.totalSubmissions = scores.length;
    this.statistics.passRate = (scores.filter(s => s >= this.settings.passingScore).length / scores.length) * 100;
  }

  return this.save();
};

// Method to submit assessment
assessmentSchema.methods.submitAssessment = function(studentId, answers) {
  const submission = {
    student: studentId,
    answers,
    submitTime: new Date(),
    status: 'submitted'
  };

  // Calculate time spent
  const startTime = this.submissions.find(s => s.student.toString() === studentId.toString())?.startTime;
  if (startTime) {
    submission.timeSpent = Math.round((submission.submitTime - startTime) / 60000); // Convert to minutes
  }

  this.submissions.push(submission);
  return this.save();
};

// Method to grade assessment
assessmentSchema.methods.gradeAssessment = function(submissionId, grades, graderId) {
  const submission = this.submissions.id(submissionId);
  if (!submission) return Promise.reject(new Error('Submission not found'));

  submission.answers = submission.answers.map((answer, index) => ({
    ...answer,
    score: grades[index].score,
    feedback: grades[index].feedback,
    isCorrect: grades[index].isCorrect
  }));

  submission.totalScore = submission.answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  submission.status = 'graded';
  submission.gradedBy = graderId;
  submission.gradedAt = new Date();

  return this.save().then(() => this.calculateStatistics());
};

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;