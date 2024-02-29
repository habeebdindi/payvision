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

app.get('/', (req, res) => {res.send("Welcome to payvision backend!");});

db.sequelize.sync({ force: true })
  .then(() => {seed(); cron.recurringJob();})
  .then(() => {
    app.listen(port, () => {console.log(`server running port ${port}`);});
  })
  .catch((err) => console.log(err));
