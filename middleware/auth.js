const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Check Authorization header with following format 'Bearer <token>'
    const token = req.header('Authorization').split(' ')[1];
    const verified = jwt.verify(token, 'jwt_secret');
    req.userId = verified._id;
    const user = await User.findById(verified._id);
    req.userIsAdmin = user.isAdmin;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send('Auth failed');
  }
};

module.exports = auth;
