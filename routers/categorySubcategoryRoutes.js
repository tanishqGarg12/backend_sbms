// routes/categorySubcategoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subcategoryController');

// Category Routes
router.post('/categories', categoryController.createCategory); // Create a new category
router.get('/categories', categoryController.getAllCategories); // Get all categories

// Subcategory Routes
router.post('/subcategories', subcategoryController.createSubcategory); // Create a new subcategory
router.get('/subcategories', subcategoryController.getAllSubcategories); // Get all subcategories

module.exports = router;
