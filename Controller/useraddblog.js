const AddBlog = require('../Schemas/addblog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const blogsUploadDir = path.join(__dirname, '..', 'uploads', 'blogs');

if (!fs.existsSync(blogsUploadDir)) {
  fs.mkdirSync(blogsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const blogMulterInstance = multer({ storage: storage });
exports.upload = blogMulterInstance; 


exports.addBlog = async (req, res) => {
  try {
    console.log("API called");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { blogName, blogTitle, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!blogName || !blogTitle || !description) {
      if (req.file) {
        fs.unlinkSync(path.join(blogsUploadDir, req.file.filename));
      }
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBlog = new AddBlog({ image, blogName, blogTitle, description });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (err) {
    console.error(err);
    if (req.file) {
      fs.unlinkSync(path.join(blogsUploadDir, req.file.filename));
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await AddBlog.find();
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blogToDelete = await AddBlog.findById(id);
    if (!blogToDelete) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blogToDelete.image) {
      const imagePath = path.join(blogsUploadDir, blogToDelete.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted old blog image: ${imagePath}`);
      } else {
        console.warn(`Old blog image not found at path: ${imagePath}`);
      }
    }

    await AddBlog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogName, blogTitle, description } = req.body;

    const existingBlog = await AddBlog.findById(id);
    if (!existingBlog) {
      if (req.file) {
        fs.unlinkSync(path.join(blogsUploadDir, req.file.filename));
      }
      return res.status(404).json({ error: 'Blog not found' });
    }

    let updatedImage = existingBlog.image;

    if (req.file) {
      if (existingBlog.image) {
        const oldImagePath = path.join(blogsUploadDir, existingBlog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old blog image during update: ${oldImagePath}`);
        } else {
          console.warn(`Old blog image not found during update at path: ${oldImagePath}`);
        }
      }
      updatedImage = req.file.filename;
    }

    const updatedData = { blogName, blogTitle, description };
    if (updatedImage) updatedData.image = updatedImage;

    const updatedBlog = await AddBlog.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (err) {
    console.error('Update Error:', err);
    if (req.file) {
        fs.unlinkSync(path.join(blogsUploadDir, req.file.filename));
    }
    res.status(500).json({ error: err.message });
  }
};