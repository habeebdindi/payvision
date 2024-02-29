const db = require('../models');
const Category = db.category;

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({message: 'Bad Request. Incomplete Information'});
    }
    const category = Category.create({ name: name, description: description || 'No description' });
    res.status(200).json(category);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = Category.findAll();
    res.status(200).json(categories);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}