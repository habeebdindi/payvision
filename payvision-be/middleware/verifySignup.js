const db = require('../model');
const User = db.user;

const verifySignup = (req, res, next) => {
    try {
	{username, email} = req.body;
	let user = await User.findOne({where: {username}});
	if (user) {
	    return res.status(400).json({message: "This username has been taken!"});
	}
	user = await User.findOne({where: {email}});
	if (user) {
	    return res.status(400).json({message: "This email has been taken!"});
	}
	next();
    } catch (e) {
	return res.status(500).send({message: "Validation error!"});
    }
}

module.exports = verifySignup;
