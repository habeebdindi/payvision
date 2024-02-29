const db = require('../models');
const User = db.user;

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findByPk(userId, {
      attributes: [
        'username',
        'email',
        'balance',
        'totalCredit',
        'totalDebit',
        'balance',
        'currency',
      ]
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({message: e.message});
  } 
}
