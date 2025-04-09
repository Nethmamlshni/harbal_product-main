import BlogPost from '../Models/Blog.js';
import Comment from '../Models/comment.js';
import cloudinary from 'cloudinary'; 


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,        
  api_secret: process.env.API_SECRET,   
});

const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    console.log('Image uploaded successfully:', result.secure_url);
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

    const newPost = new BlogPost({
      title,
      content,
      featuredImage: uploadedFeaturedImage,
      imageGallery: uploadedImageGallery,
      videoUrl,
      tags,
      relatedProducts,
      author,
    });

    await newPost.save();
    res.status(201).json({ message: 'Blog post created successfully', post: newPost });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all blog posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ publishDate: -1 });  // Sorting by publish date, descending
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single blog post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author').populate('relatedProducts');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const newComment = new Comment({
      postId,
      text,
      userId: req.user.id,
      createdAt: new Date(),
    });

    await newComment.save();
    const post = await Blog.findById(postId);
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search and filter blog posts
export const searchPosts = async (req, res) => {
  try {
    const { title, tags } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' }; 
    if (tags) query.tags = { $in: tags.split(',') }; 

    const posts = await Blog.find(query).sort({ publishDate: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
