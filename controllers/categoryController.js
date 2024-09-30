// controllers/categoryController.js

const Category = require('../models/category');

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  
  const newCategory = new Category({
    name,
    description,
    subcategories: [], // Initialize with an empty array
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
