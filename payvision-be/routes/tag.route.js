const express = require('express');
const router = express.Router();

const controller = require('../controllers/tag.controller');
const { authorization } = require('../middleware');

// Tags are predefined in the system.

//router.post('/new', authorization, controller.createTag);

router.get('/all', authorization, controller.getTags);
router.get('/:id/categories', authorization, controller.getTagCategories);

module.exports = router;
