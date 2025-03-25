import mongoose from 'mongoose';

// Schema for the image gallery
const imageGallerySchema = new mongoose.Schema({
  imageUrl: { type: String }
});

// Schema for the blog post
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },  
  featuredImage: { type: String },
  imageGallery: [imageGallerySchema],  
  videoUrl: { type: String },  
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishDate: { type: Date, default: Date.now },
  tags: [{ type: String }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
