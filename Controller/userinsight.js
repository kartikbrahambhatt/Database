const AddInsight = require('../Schemas/insight');
const cloudinary = require('../config/cloudinary');

const addInsight = async (req, res) => {
  try {
    const {
      AuthorName,
      Title,
      Heading,
      Description,
      Category
    } = req.body;

    let Image = null;

    if (req.file) {
      Image = cloudinary.url(req.file.path, {
        secure: true
      });
    }

    const newInsight = new AddInsight({
      AuthorName,
      Title,
      Heading,
      Description,
      Image,
      Category
    });

    await newInsight.save();

    res.status(201).json({
      message: 'Insight added successfully',
      insight: newInsight
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error adding Insight'
    });
  }
};


const getAllInsights = async (req, res) => {
  try {
    const insights = await AddInsight
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(insights);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching insights'
    });
  }
};


const editInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      AuthorName,
      Title,
      Heading,
      Description,
      Category
    } = req.body;

    const existingInsight = await AddInsight.findById(id);

    if (!existingInsight) {
      return res.status(404).json({
        message: 'Insight not found'
      });
    }

    let updatedImage = existingInsight.Image;

    if (req.file) {
      updatedImage = cloudinary.url(req.file.path, {
        secure: true
      });
    }

    const updatedData = {
      AuthorName,
      Title,
      Heading,
      Description,
      Image: updatedImage,
      Category
    };

    const updatedInsight = await AddInsight.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      message: 'Insight updated successfully',
      insight: updatedInsight
    });

  } catch (error) {
    console.error('Update error:', error);

    res.status(500).json({
      message: 'Error updating Insight'
    });
  }
};


const deleteInsight = async (req, res) => {
  try {
    const { id } = req.params;

    const insight = await AddInsight.findById(id);

    if (!insight) {
      return res.status(404).json({
        message: 'Insight not found'
      });
    }

    await AddInsight.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Insight deleted successfully'
    });

  } catch (error) {
    console.error('Delete Error:', error);

    res.status(500).json({
      message: 'Error deleting Insight'
    });
  }
};


module.exports = {
  addInsight,
  getAllInsights,
  editInsight,
  deleteInsight
};