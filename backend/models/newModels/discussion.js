import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['question', 'discussion', 'announcement'], required: true },
  tags: [{ type: String }],
  attachments: [{
    name: { type: String },
    url: { type: String },
    type: { type: String }
  }],
  replies: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{
      name: { type: String },
      url: { type: String },
      type: { type: String }
    }],
    votes: {
      upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    isAnswer: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  votes: {
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  status: { type: String, enum: ['open', 'closed', 'resolved'], default: 'open' },
  views: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastActivity: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
discussionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.lastActivity = Date.now();
  next();
});

// Method to add reply
discussionSchema.methods.addReply = function(userId, content, attachments = []) {
  this.replies.push({
    content,
    author: userId,
    attachments,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return this.save();
};

// Method to mark reply as answer
discussionSchema.methods.markAsAnswer = function(replyId) {
  const reply = this.replies.id(replyId);
  if (!reply) return Promise.reject(new Error('Reply not found'));
  
  reply.isAnswer = true;
  this.status = 'resolved';
  return this.save();
};

// Method to vote
discussionSchema.methods.vote = function(userId, voteType, isUpvote) {
  const votes = voteType === 'discussion' ? this.votes : this.replies.id(voteType).votes;
  
  if (isUpvote) {
    if (!votes.upvotes.includes(userId)) {
      votes.upvotes.push(userId);
      votes.downvotes = votes.downvotes.filter(id => id.toString() !== userId.toString());
    }
  } else {
    if (!votes.downvotes.includes(userId)) {
      votes.downvotes.push(userId);
      votes.upvotes = votes.upvotes.filter(id => id.toString() !== userId.toString());
    }
  }
  
  return this.save();
};

// Method to follow discussion
discussionSchema.methods.toggleFollow = function(userId) {
  const isFollowing = this.followers.includes(userId);
  if (isFollowing) {
    this.followers = this.followers.filter(id => id.toString() !== userId.toString());
  } else {
    this.followers.push(userId);
  }
  return this.save();
};

// Method to increment view count
discussionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;