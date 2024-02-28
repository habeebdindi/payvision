const mysqlConfig = require('../config/db.config.js');

const User = require('../models/user.model.js');
const Category = require('../models/categories.model.js');
const Transaction = require('../models/transaction.model.js');
const Tag = require('../models/tag.model.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  mysqlConfig.DB,
  mysqlConfig.USER,
  mysqlConfig.PASSWORD,
  {
    host: mysqlConfig.HOST,
    dialect: mysqlConfig.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  }
);

const db = {Sequelize, sequelize};

db.user = User(sequelize, Sequelize);
db.category = Category(sequelize, Sequelize);
db.transaction = Transaction(sequelize, Sequelize);
db.tag = Tag(sequelize, Sequelize);

db.user.hasMany(db.transaction);
db.transaction.belongsTo(db.user);

db.category.hasMany(db.transaction);
db.transaction.belongsTo(db.category);

db.tag.hasOne(db.category);
db.category.belongsTo(db.tag);

module.exports = db;
