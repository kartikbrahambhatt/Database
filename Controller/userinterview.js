const AddInterview = require('../Schemas/interview');
const path = require('path');
const fs = require('fs');

const addInterview = async (req, res) => {
  try {
    const { Name, CompanyName, Description, Position, CompanyURL } = req.body;
    const Image = req.file ? req.file.filename : null;

    const newInterview = new AddInterview({
      Name,
      CompanyName,
      Description,
      Position,
      CompanyURL,
      Image
    });

    await newInterview.save();
    res.status(201).json({ message: 'Interview added successfully', interview: newInterview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding interview' });
  }
};

const getAllInterviews = async (req, res) => {
  try {
    const interviews = await AddInterview.find().sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};

const editInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, CompanyName, Description, Position, CompanyURL } = req.body;

    const existingInterview = await AddInterview.findById(id);
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    let updatedImage = existingInterview.Image;
    if (req.file) {
      if (existingInterview.Image) {
        const oldPath = path.join(__dirname, '../uploads/interviews', existingInterview.Image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImage = req.file.filename;
    }

    const updatedData = {
      Name,
      CompanyName,
      Description,
      Position,
      CompanyURL,
      Image: updatedImage,
    };

    const updatedInterview = await AddInterview.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Interview updated successfully', interview: updatedInterview });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating interview' });
  }
};


const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await AddInterview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.Image) {
      const imagePath = path.join(__dirname, '../uploads/interviews', interview.Image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await AddInterview.findByIdAndDelete(id);
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Error deleting interview' });
  }
};

module.exports = {
  addInterview,
  getAllInterviews,
  editInterview,
  deleteInterview
};
