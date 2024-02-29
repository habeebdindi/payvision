//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define("tag", {
    name: {
      type: Sequelize.STRING,
      unique: true,
    }
  });
  return Tag;
};
