// POST /api/comments
import Comment from "../Models/comment.js";

export const createComment = async (req, res) => {
  try {
    const { postId, commentText, author } = req.body;
    const newComment = new Comment({ postId, commentText, author });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/comments
export const getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find().populate('author', 'name').populate('postId', 'title');
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // GET /api/comments/:id
export const getCommentById = async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id).populate('author', 'name');
      if (!comment) return res.status(404).json({ message: "Comment not found" });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // PUT /api/comments/:id
export const updateComment = async (req, res) => {
    try {
      const { commentText } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        { commentText },
        { new: true }
      );
      if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
    try {
      const deleted = await Comment.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Comment not found" });
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  