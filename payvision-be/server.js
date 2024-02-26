require('dotenv').config();
const express = require('express');

const cors = require('cors');
const db = require('./models');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.route'));

app.get('/', (req, res) => {res.send("Welcome to payvision backend!")});


db.sync({ alter: true })
  .then((result) => {
    app.listen(port, () => {console.log(`server running port ${port}`);});
  })
  .catch((err) => console.log(err));
