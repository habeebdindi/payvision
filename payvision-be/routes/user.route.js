const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const { authorization } = require('../middleware');

router.get('/', authorization, controller.getUser);

module.exports = router
