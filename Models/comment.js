import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
    commentText: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    datePosted: { type: Date, default: Date.now }
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  export default Comment;
  