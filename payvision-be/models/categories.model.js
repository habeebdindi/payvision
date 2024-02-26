//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
  });
  return Category;
};
