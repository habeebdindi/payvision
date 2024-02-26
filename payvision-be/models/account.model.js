//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    balance: {
      type: Sequelize.INTEGER,
    },
    totalCredit: {
      type: Sequelize.FLOAT,
    },
    totalDebit: {
      type: Sequelize.FLOAT,
    },
  });
  return Account;
};
