const authSecret = process.env.AUTH_SECRET;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
	    return res.status(403).send({message: "Please provide token!"});
	}
	jwt.verify(token, authSecret, (err, user) => {
	    if (err) {
		console.log(err);
		return res.status(401).send({message: "Unauthorized!"});
	    }
	    req.user = user;
	    next();
	});
    } catch (e) {
	return res.status(500).send({message: "Authorization error!"});
    }
}

module.exports = verifyToken;
