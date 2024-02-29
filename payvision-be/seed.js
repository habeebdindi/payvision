const faker = require('faker');
const bcrypt = require('bcryptjs');
const db = require('./models');

const User = db.user;
const Category = db.category;
const Transaction = db.transaction;
const Tag = db.tag;


module.exports = async function seed() {
  try {
    let user = await User.findOne({where: {username: 'payvision'}});
    if (!user) {
      user = await User.create({
        username: "payvision",
        fullname: "ALX Payvision",
        email: "admin@payvision.com",
        password: bcrypt.hashSync("PAYVISION_PASS", 5),
        balance: faker.random.float({min: 0, max: 1000000, precision: 2}),
        currency: faker.finance.currencyCode(),
        totalCredit: faker.random.float({min: 0, max: 10000000, precision: 2}),
        totalDebit: faker.random.float({min: 0, max: 10000000, precision: 2}),
      });
    }

    const tags = ['debit', 'credit'];
    const tag = await Tag.create({
      name: tags[Math.floor(Math.random() * tags.length)]
    });

    const categories = ['food', 'clothing', 'transportation',
      'utilities', 'entertainment', 'miscellaneous'];
    const category = await Category.create({
      name: categories[Math.floor(Math.random() * categories.length)],
      description: faker.lorem.paragraph(),
      tagId: tag.id
    });

    const methods = ['card', 'cash', 'item'];
    const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
//    const transaction = await Transaction.create({
//      description: faker.lorem.paragraph(),
//      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
//      date: faker.date.future(),
//      amount: faker.random.float({min: 100, max: 200000, precision: 2}),
//      recurred: faker.random.boolean(),
//      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
//      categoryId: category.id,
//      userId: user.id
//    });
      const transaction = await Transaction.create({
	    amount: faker.random.float({min: 100, max: 200000, precision: 2}),
	    description: faker.lorem.paragraph(),
	    paymentMethod: 'cash',
	    currency: 'NGN',
            frequency: 'daily',
            date: new Date('2024-01-01'),
	    recurred: true,
	    categoryId: 1,
	    userId: 1,
	});

  } catch (e) {
    console.log(e);
  }
}
