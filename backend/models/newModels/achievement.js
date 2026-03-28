import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['course', 'participation', 'skill', 'milestone'], required: true },
  type: { type: String, enum: ['completion', 'grade', 'engagement', 'streak', 'custom'], required: true },
  criteria: {
    type: { type: String, required: true }, // e.g., 'courses_completed', 'discussion_posts', 'perfect_score'
    threshold: { type: Number, required: true }, // value to achieve
    timeframe: { type: String }, // optional timeframe (e.g., 'daily', 'weekly', 'monthly')
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // optional specific course
    additionalParams: { type: mongoose.Schema.Mixed } // flexible additional parameters
  },
  reward: {
    points: { type: Number, default: 0 },
    badge: {
      name: { type: String, required: true },
      image: { type: String, required: true }, // URL to badge image
      level: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], required: true }
    },
    unlocks: [{ type: String }] // special features or content unlocked
  },
  visibility: {
    isPublic: { type: Boolean, default: true },
    displayOnProfile: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true }
  },
  progress: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentValue: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    progress: { type: Number, default: 0 }, // percentage progress
    history: [{
      value: { type: Number },
      date: { type: Date },
      details: { type: String }
    }]
  }],
  statistics: {
    timesAwarded: { type: Number, default: 0 },
    lastAwarded: { type: Date },
    completionRate: { type: Number, default: 0 }, // percentage of users who earned it
    averageTimeToEarn: { type: Number } // average days to earn
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if user has earned achievement
achievementSchema.methods.checkCompletion = function(userId, currentValue) {
  const userProgress = this.progress.find(p => p.user.toString() === userId.toString());
  
  if (!userProgress) {
    this.progress.push({
      user: userId,
      currentValue,
      progress: (currentValue / this.criteria.threshold) * 100
    });
  } else {
    userProgress.currentValue = currentValue;
    userProgress.progress = (currentValue / this.criteria.threshold) * 100;
  }

  const isCompleted = currentValue >= this.criteria.threshold;
  if (isCompleted) {
    const progress = this.progress.find(p => p.user.toString() === userId.toString());
    if (progress && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      this.statistics.timesAwarded += 1;
      this.statistics.lastAwarded = new Date();
      
      // Update completion rate
      const totalUsers = this.progress.length;
      const completedUsers = this.progress.filter(p => p.isCompleted).length;
      this.statistics.completionRate = (completedUsers / totalUsers) * 100;
    }
  }

  return this.save();
};

// Method to get user progress
achievementSchema.methods.getUserProgress = function(userId) {
  return this.progress.find(p => p.user.toString() === userId.toString()) || null;
};

// Method to update achievement statistics
achievementSchema.methods.updateStatistics = function() {
  const completedProgress = this.progress.filter(p => p.isCompleted);
  
  if (completedProgress.length > 0) {
    // Calculate average time to earn
    const totalDays = completedProgress.reduce((sum, p) => {
      return sum + (p.completedAt - this.createdAt) / (1000 * 60 * 60 * 24);
    }, 0);
    this.statistics.averageTimeToEarn = totalDays / completedProgress.length;
    
    // Update completion rate
    this.statistics.completionRate = (completedProgress.length / this.progress.length) * 100;
  }
  
  return this.save();
};

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;