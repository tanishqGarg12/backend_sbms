

const Subcategory = require('../models/subcategory');
const Category = require('../models/category');

const createSubcategory = async (req, res) => {
  const { name, description, categoryId } = req.body;
  
  const newSubcategory = new Subcategory({
    name,
    description,
    categoryId,
  });

  try {
    const savedSubcategory = await newSubcategory.save();
    console.log(savedSubcategory)
    
    // Optionally, you can also update the parent category to include this subcategory
    await Category.findByIdAndUpdate(categoryId, {
      $push: { subcategories: savedSubcategory._id },
    });

    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
};
