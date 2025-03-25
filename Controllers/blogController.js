import BlogPost from '../Models/Blog.js';

// Create a new blog post
export const createPost = async (req, res) => {
  try {
    const { title, content, featuredImage, author, tags } = req.body;
    const newPost = new BlogPost({ title, content, featuredImage, author, tags, datePublished: new Date() });
    await newPost.save();
    res.status(201).json({ message: 'Blog post created successfully', post: newPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all blog posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ datePublished: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single blog post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a blog post
export const updatePost = async (req, res) => {
  try {
    const { title, content, featuredImage, author, tags } = req.body;
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { title, content, featuredImage, author, tags }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog post
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  try {
    const { postId, commentText } = req.body;
    const newComment = new Comment({ postId, commentText, author: req.user.id, datePosted: new Date() });
    await newComment.save();

    const post = await BlogPost.findById(postId);
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('comments');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
