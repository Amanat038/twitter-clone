const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true
  },
  commentedBy: {
    type: ObjectId,
    ref: "UserModel",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  likes: [
    {
      type: ObjectId,
      ref: "UserModel"
    }
  ],
  comments: [commentSchema],
  image: {
    type: String,
  },
  author: {
    type: ObjectId,
    ref: "UserModel",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  originalAuthor: { 
    type: ObjectId, 
    ref: "UserModel" 
  },
  retweets: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true 
});

const PostModel = mongoose.model('PostModel', postSchema);
module.exports = PostModel;
