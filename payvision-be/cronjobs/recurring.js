const cron = require('node-cron');
const db = require('../models');

const Transaction = db.transaction;
const User = db.user;
const Tag = db.tag;
const Category = db.category;

function recurringJob() {
    cron.schedule('0 0 * * *', async () => {
	try {
            const recurringTransactions = await Transaction.findAll({ where: { recurring: true } });
            Promise.all(
		recurringTransactions.map(async (transaction) => {
		    const nextOccurrenceDate = nextOccurrenceDate(transaction);
		    if (isSameDate(nextOccurrenceDate, transaction.date)) {
			const newTransaction = await Transaction.create({
			    description: `RENEWAL: ${transaction.description}`,
			    amount: transaction.amount,
			    categoryId: transaction.categoryId,
			    userId: transaction.userId,
			    currency: transaction.currency,
			    paymentMethod: transaction.paymentMethod,
			    date: nextOccurrenceDate,
			    recurred: transaction.recurred,
			});
			const user = await User.findByPk(transaction.userId);
			const category = await Category.findByPk(transaction.categoryId, {
			    attributes: [],
			    include: [{model: Tag, attributes: ['name'],}],
			});
			if (category.tags.name === 'debit') {
			    user.totalDebit += newTransaction.amount;
			    user.balance -= newTransaction.amount;
			} else {
			    user.totalCredit += newTransaction.amount;
			    user.balance += newTransaction.amount;
			}
			await user.save();
		    }
		})
	    )
	} catch (error) {
            console.error('Error creating recurring transactions:', error);
	}
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

module.exports = recurringJob;
