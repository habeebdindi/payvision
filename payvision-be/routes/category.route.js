const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.controller');
const { authorization } = require('../middleware');

router.post('/new', authorization, controller.createCategory);
router.get('/all', authorization, controller.getCategories);

module.exports = router;
