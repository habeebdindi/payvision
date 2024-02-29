const db = require('../models');
const Transaction = db.transaction;
const Category = db.category;
const Tag = db.tag;
const User = db.user;


exports.createTransaction = async (req, res) => {    
  try {
    const { userId } = req.user;
    const { description, amount, frequency,
            paymentMethod, date, recurred, categoryId } = req?.body;
    if (!(amount && categoryId && paymentMethod)) {
      res.status(400).json({message: 'Bad Request. Incomplete Information'});
    }
    const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
    if (recurred && (!(frequency) || !(frequencies.includes(frequency)))) {
        res.status(400).json({message: 'Bad Request. No Frequency Specified'});
    }
    if (!recurred && frequencies.includes(frequency)) {
        res.status(400).json({message: 'Bad Request. Recurred and Frequency Mismatch'});
    }
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Tag, attributes: ['name'], as: 'tag' }],
    })
    if (!category) {
      res.status(400).json({message: 'Bad Request. No Such Category'});
    }
    const newTransaction = await Transaction.create({
      description: description || 'No Description',
      amount: amount,
      paymentMethod: paymentMethod,
      date: date || new Date(),
      userId: userId,
      recurred: recurred || false,
      frequency: frequency || 'none',
      categoryId: categoryId,
    });
    const user = await User.findByPk(userId);
    if (category.tag.name == 'debit') {
      user.totalDebit += newTransaction.amount;
      user.balance -= newTransaction.amount;
    } else {
      user.totalCredit += newTransaction.amount;
      user.balance += newTransaction.amount;
    }
    await user.save();
    res.status(200).json({message: "Transaction created successfully"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req?.user;
    const transactions = await Transaction.findAll({
      where: { 'userId': userId },
      attributes: [
        'amount',
        'date',
        'description',
        'paymentMethod'
      ],
      include: [{
        model: Category,
        attributes: ['name'],
        as: 'category',
        include: [{
          model: Tag,
          attributes: ['name'],
          as: 'tag',
        }]
      }],
    })
    res.status(200).json(transactions)
  } catch (e) {
    res.status(500).json({message: e.message})
  }
}

exports.getRecurringTransactions = async (req, res) => {
    try {
      const { userId } = req?.user;
      const transactions = await Transaction.findAll({
        where: { 'userId': userId, recurred: true },
        attributes: [
          'amount',
          'date',
          'description',
          'paymentMethod'
        ],
        include: [{
          model: Category,
          attributes: ['name'],
          as: 'category',
          include: [{
            model: Tag,
            attributes: ['name'],
            as: 'tag',
          }]
        }],
      })
      res.status(200).json(transactions)
    } catch (e) {
      res.status(500).json({message: e.message})
    }
  }
