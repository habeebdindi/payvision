require('dotenv').config();
const express = require('express');

const cors = require('cors');
const db = require('./models');
const seed = require('./seed');
const cron = require('./cronjobs/recurring.js');

const app = express();
const port = process.env.PORT || 8000;


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/transaction', require('./routes/transaction.route'));
app.use('/api/user', require('./routes/user.route'));

// Tags and categories are predefined in the system.

//app.use('/api/tag', require('./routes/tag.route'));
//app.use('/api/category', require('./routes/category.route'));


app.get('/', (req, res) => {res.send("Welcome to payvision backend!");});

db.sequelize.sync()
  .then(() => {
//    seed();
    cron.recurringJob();
  })
  .then(() => {
    app.listen(port, () => {console.log(`server running port ${port}`);});
  })
  .catch((err) => console.log(err));
