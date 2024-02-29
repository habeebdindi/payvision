const cron = require('node-cron');
const db = require('../models');

const Transaction = db.transaction;
const User = db.user;
const Tag = db.tag;
const Category = db.category;

function recurringJob() {
  return new Promise((resolve, reject) => {
    cron.schedule('0 0 * * *', async () => {
      try {
        const recurringTransactions = await Transaction.findAll({ where: { recurred: true } });
        await Promise.all(
          recurringTransactions.map(async (transaction) => {
            const nextDate = await nextOccurrenceDate(transaction);
            const today = new Date();
            if (isSameDate(nextDate, today)) {
              const newTransaction = await Transaction.create({
                description: `RENEWAL: ${transaction.description}`,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                amount: transaction.amount,
                userId: transaction.userId,
                currency: transaction.currency,
                frequency: 'none',
                paymentMethod: transaction.paymentMethod,
                date: nextDate,
                recurred: false,
              });
              const user = await User.findByPk(transaction.userId);
              const category = await Category.findByPk(transaction.categoryId, {
                include: [{ model: Tag, attributes: ['name'] }],
              });
              if (category['tag.name'] === 'debit') {
                user.totalDebit += transaction.amount;
                user.balance -= transaction.amount;
              } else {
                user.totalCredit += transaction.amount;
                user.balance += transaction.amount;
              }
              await user.save();
            }
          })
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

function nextOccurrenceDate(transaction) {
    const frequency = transaction.frequency;
    const date = new Date(transaction['date']);
    if (frequency === 'daily') {
	date.setDate(date.getDate() + 1);
    } else if (frequency === 'weekly') {
	date.setDate(date.getDate() + 7);
    } else if (frequency === 'monthly') {
	date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'yearly') {
	date.setFullYear(date.getFullYear() + 1);
    }
    return date;
}

function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
    );
}

module.exports = { recurringJob, nextOccurrenceDate, isSameDate };
