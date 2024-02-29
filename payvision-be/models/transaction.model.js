//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transaction", {
    description: {
      type: Sequelize.TEXT,
    },
    paymentMethod: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    recurred: {
      type: Sequelize.BOOLEAN,
    },
    frequency: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
  });
  return Transaction;
};
