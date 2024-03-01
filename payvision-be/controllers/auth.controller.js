const db = require('../models');
const User = db.user;
const authSecret = process.env.AUTH_SECRET;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const {username, email, password, currency, } = req?.body;
    const user = await User.create({
      username, email, currency, password: bcrypt.hashSync(password, 5)
    });
    res.status(200).json({message: "Registration was successful!"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.signin = async (req, res) => {
  try {
    const {username, password} = req?.body
    const user = await User.findOne({ where: {username} });
    if (!user) {
      res.status(404).json({message: "User Not found!"});
    }
    const check = user.password || bcrypt.compareSync(user.password, password);
    if (!check) {
      res.status(401).json({message: "Incorrect Password!"});
    }
    const token = jwt.sign({userId: user.id}, authSecret, { expiresIn: 86400 });
    res.status(200).json({message: "Signin successful!", token: token});
  } catch (e) {
    res.status(500).json({message: "Internal server error!"});
  }
}

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).json({message: "Signed out!"});
  } catch (e) {
    res.status(500).json({message: "Internal server error!"});
  }
}
