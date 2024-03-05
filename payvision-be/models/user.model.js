//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    otp: {
      type: Sequelize.INTEGER,
      unique: true
    },
    otpExp: {
      type: Sequelize.DATE,
    },
    balance: {
      type: Sequelize.DOUBLE,
    },
    totalCredit: {
      type: Sequelize.DOUBLE,
    },
    currency: {
      type: Sequelize.STRING,
      default: "NGN",
    },
    totalDebit: {
      type: Sequelize.DOUBLE,
    },
  });
  return User;
};
