//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        description: {
            type: Sequelize.TEXT,
	},
        type: {
            type: Sequelize.STRING,
	},
        paymentMethod: {
            type: Sequelize.STRING,
	},
        date: {
            type: Sequelize.DATETIME,
	},
        currency: {
            type: Sequelize.STRING,
	},
        recurring: {
            type: Sequelize.BOOLEAN,
	},
    });
    return Transaction;
};
