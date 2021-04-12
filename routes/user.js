const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all users (only allowed to admin)
router.get('/', auth, async (req, res) => {
  if (req.userIsAdmin) {
    const users = await User.find({});
    res.status(200).send(users);
  } else {
    res.status(400).send('Only admin can see list of users');
  }
});

module.exports = router;
