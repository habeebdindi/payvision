const express = require('express');
const router = express.Router();

const controller = require('../controllers/transaction.controller');
const { authorization } = require('../middleware');

router.post('/new', authorization, controller.createTransaction);
router.get('/all', authorization, controller.getTransactions);
router.get('/recurring', authorization, controller.getRecurringTransactions);
router.post('/cancel_recur', authorization, controller.cancelRecurring);

module.exports = router;
