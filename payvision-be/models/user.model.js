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
        }
    });
    return User;
};
