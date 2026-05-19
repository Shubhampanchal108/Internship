const express = require('express');
const connectDB = require('./connection');
const { Blog } = require('./models');
const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a new blog post
app.post('/blogs', async (req, res) => {
  try { 
    const { id, title, content } = req.body;
    const newBlog = new Blog({ id, title, content });
    await newBlog.save();
    res.status(201).json(newBlog);
  }
    catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Get all blog posts
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get a single blog post by ID
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
  try { 
    const { title, content } = req.body;
    const updatedBlog = await Blog.findOneAndUpdate(
      { id: req.params.id },
        { title, content },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});


// Delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ id: req.params.id });
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});