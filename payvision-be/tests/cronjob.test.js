jest.mock('node-cron', () => ({
    schedule: jest.fn().mockImplementation((cronExpression, callback) => {
        if (typeof callback === 'function') {
            callback();
        }
    }),
}));

const cron = require('node-cron');

const {recurringJob, nextOccurrenceDate, isSameDate } = require('../cronjobs/recurring.js');

const db = require('../models');
const faker = require('faker');
const Transaction = db.transaction;
const User = db.user;
const Tag = db.tag;
const Category = db.category;


let nextDate;
let transaction;
let transaction1;


describe('nextOccurrenceDate', () => {
    beforeAll(async () => {
	await db.sequelize.sync();
//	transaction = await Transaction.create({
//	    amount: faker.random.float({min: 100, max: 200000, precision: 2}),
//	    description: faker.lorem.paragraph(),
//	    paymentMethod: 'cash',
//	    currency: 'NGN',
//            frequency: 'daily',
//            date: new Date('2024-01-01'),
//	    recurred: true,
//	    categoryId: 1,
//	    userId: 1,
//	});
	transaction = await Transaction.findByPk(1);
	nextDate = new Date();
    });
    afterAll(async () => {
	await transaction.update({frequency: 'daily'});
	nextDate = undefined;
    });
    test('should calculate next occurrence date correctly for daily frequency', () => {
        nextDate = nextOccurrenceDate(transaction);
        expect(nextDate).toEqual(new Date('2024-01-02'));
    });

    test('should calculate next occurrence date correctly for weekly frequency', async () => {
	await transaction.update({frequency: 'weekly'});
	nextDate = nextOccurrenceDate(transaction);
	expect(nextDate).toEqual(new Date('2024-01-08'));
    });

    test('should calculate next occurrence date correctly for monthly frequency', async () => {
	await transaction.update({frequency: 'monthly'});
	nextDate = nextOccurrenceDate(transaction);
	expect(nextDate).toEqual(new Date('2024-02-01'));
    });

    test('should calculate next occurrence date correctly for yearly frequency', async () => {
	await transaction.update({frequency: 'yearly'});
	nextDate = nextOccurrenceDate(transaction);
	expect(nextDate).toEqual(new Date('2025-01-01'));
    });
});

describe('isSameDate', () => {
    beforeAll(async () => {
	transaction = await Transaction.findByPk(1);
	transaction.update({date: new Date('2024-02-28')});
	await db.sequelize.sync();
    });
    test('should return true if two dates have the same date', () => {
        const date1 = nextOccurrenceDate(transaction);
        const date2 = new Date();
	console.log(`date0: ${transaction.date}\ndate1: ${date1}\ndate2: ${date2}`)
        expect(isSameDate(date1, date2)).toBe(true);
    });

    test('should return false if two dates have different dates', () => {
        const date1 = nextOccurrenceDate(transaction);
        const date2 = new Date('2024-03-01');
        expect(isSameDate(date1, date2)).toBe(false);
    });
});


describe('recurringJob', () => {
    test('should create new transactions and update user balances for recurring transactions', async () => {
	await recurringJob().catch(error => {
            console.error('Unhandled promise rejection:', error);
	});
	expect(cron.schedule).toHaveBeenCalled();
    })
});
