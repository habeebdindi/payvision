const db = require('../models');
const Tag = db.tag;

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({message: 'Bad Request. Incomplete Information'});
    }
    const tag = Tag.create({ name });
    res.status(200).json(tag);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.getTags = async (req, res) => {
  try {
    const tags = Tag.findAll();
    res.status(200).json(tags);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.getTagCategories = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: 'Tag Not Found'})
    }
    const categories = await tag.getCategories();
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}