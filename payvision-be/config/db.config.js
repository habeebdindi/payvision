require('dotenv').config();

const dev = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB,
    dialect: process.env.DB_DIALECT,
    pool: {
	max: 5,
	min: 0,
	acquire: 30000,
	idle: 10000
    }
}
const prod = {
    HOST: process.env.RDS_HOST,
    USER: process.env.RDS_USER,
    PASSWORD: process.env.RDS_PASS,
    DB: process.env.RDB,
    dialect: process.env.DB_DIALECT,
    pool: {
	max: 5,
	min: 0,
	acquire: 30000,
	idle: 10000
    }
};

module.exports = prod;
