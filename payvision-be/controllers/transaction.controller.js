const db = require('../models');
const Transaction = db.transaction;
const Category = db.category;
const Tag = db.tag;
const User = db.user;


exports.createTransaction = async (req, res) => {    
  try {
    const { userId } = req.user;
    const { description, amount, frequency,
            paymentMethod, date, categoryId } = req?.body;
    if (!(amount && categoryId && paymentMethod)) {
      res.status(400).json({message: 'Bad Request. Incomplete Information'});
    }
    const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
    let recurred = true;
    const newAmount = parseInt(amount);
    if (newAmount == 0 || isNaN(newAmount)) {
      res.status(400).json({message: 'Invalid Amount'});
    }

    if (!frequencies.includes(frequency)) {
      recurred = false;
    }
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Tag, attributes: ['name'], as: 'tag' }],
    })
    if (!category) {
      res.status(400).json({message: 'Bad Request. No Such Category'});
    }
    const newTransaction = await Transaction.create({
      description: description || 'No Description',
      amount: newAmount,
      paymentMethod: paymentMethod || "cash",
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
      order: ['date', 'DESC'],
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


exports.cancelRecurring = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction =  await Transaction.findByPk(transactionId);
    transaction.recurred = false;
    await transaction.save()
    res.status(200).json({ message: "Recurring transaction succefully canceled"})
  } catch (e) {
    res.status(500).json({message: e.message})
  }
}
