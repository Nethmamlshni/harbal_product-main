import Blog from '../Models/Blog.js';
import Comment from '../Models/comment.js';
import cloudinary from 'cloudinary'; 
import mongoose from 'mongoose';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,        
  api_secret: process.env.API_SECRET,   
});

const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Create a new blog post
export const createPost = async (req, res) => {

    
    try {
      const { title, content, featuredImage, imageGallery, videoUrl, tags, relatedProducts, author } = req.body;
  
      const uploadedFeaturedImage = featuredImage ? await uploadImage(featuredImage) : null;
  
      const uploadedImageGallery = imageGallery 
        ? await Promise.all(imageGallery.map(async (img) => ({ imageUrl: await uploadImage(img) })))
        : [];
    // Create the new blog post
    const newPost = new Blog({
      title,
      content,
      featuredImage: uploadedFeaturedImage,
      imageGallery: uploadedImageGallery,
      videoUrl,
      tags,
      relatedProducts,
      author: req.user.id,
    });

    await newPost.save();
    res.status(201).json({ message: 'Blog post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    res.status(400).json({ message: error.message });
  }
};
// Get all blog posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .sort({ publishDate: -1 })
      .populate('author', 'firstname lastname email');
    if (!posts || posts.length === 0) {
      console.log('No posts found in the database.');
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message); // Debugging
    res.status(400).json({ message: error.message });
  }
};

// Get a single blog post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    // Fetch the blog post
    const blog = await Blog.findById(id).populate('author', 'firstname lastname email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error.message); // Debugging
    res.status(500).json({ message: error.message });
  }
};

// Update a blog post
export const updatePost = async (req, res) => {
  try {
    const { title, content, featuredImage, imageGallery, videoUrl, tags, relatedProducts } = req.body;

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        featuredImage,
        imageGallery,
        videoUrl,
        tags,
        relatedProducts,
      },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid blog ID'); // Debugging
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const post = await Blog.findByIdAndDelete(id);

    if (!post) {
      console.log('Post not found'); // Debugging
      return res.status(404).json({ message: 'Post not found' });
    }


    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message); // Debugging
    res.status(500).json({ message: error.message });
  }
};
// Add a comment to a blog post

export const addComment = async (req, res) => {
  try {
    const { postId, commentText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid blog post ID' });
    }

    if (!commentText || commentText.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const blog = await Blog.findById(postId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = new Comment({
      postId,
      commentText,
      author: req.user.id, // Use the authenticated user's ID
    });

    await comment.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error adding comment:', error.message); // Debugging
    res.status(500).json({ message: error.message });
  }
};
// Search and filter blog posts
export const searchPosts = async (req, res) => {
  try {
    const { title, tags } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (tags) {
      query.tags = { $in: tags.split(',') }; // Match any of the provided tags
    }

    const blogs = await Blog.find(query);

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error searching posts:', error.message); // Debugging
    res.status(500).json({ message: error.message });
  }
};