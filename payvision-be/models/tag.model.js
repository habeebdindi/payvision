//The arrow function takes in the sequelize instance and sequelize Library

module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        name: {
            type: Sequelize.INTEGER,
	}
    });
    return Account;
};
