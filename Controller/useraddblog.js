const AddBlog = require('../Schemas/addblog');
const cloudinary = require('../config/cloudinary');

exports.addBlog = async (req, res) => {
  try {
    console.log("API called");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { blogName, blogTitle, description } = req.body;

    let image = null;

    if (req.file) {
      image = cloudinary.url(req.file.path, {
        secure: true
      });
    }

    if (!blogName || !blogTitle || !description) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const newBlog = new AddBlog({
      image,
      blogName,
      blogTitle,
      description
    });

    await newBlog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog: newBlog
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await AddBlog.find();

    res.status(200).json(blogs);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blogToDelete = await AddBlog.findById(id);

    if (!blogToDelete) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    await AddBlog.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Blog deleted successfully'
    });

  } catch (err) {
    console.error('Delete Error:', err);

    res.status(500).json({
      error: err.message
    });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogName, blogTitle, description } = req.body;

    const existingBlog = await AddBlog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    let updatedImage = existingBlog.image;

    if (req.file) {
      updatedImage = cloudinary.url(req.file.path, {
        secure: true
      });
    }

    const updatedData = {
      blogName,
      blogTitle,
      description,
      image: updatedImage
    };

    const updatedBlog = await AddBlog.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });

  } catch (err) {
    console.error('Update Error:', err);

    res.status(500).json({
      error: err.message
    });
  }
};