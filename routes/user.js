const router = require('express').Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
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

// Signup non-admin users
router.post('/signup', async (req, res) => {
  // TODO: Validate body fields (use for example joi)
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Both email and password are obligatory');
  } else {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      res.status(400).send(`User with email ${email} already exists`);
    } else {
      try {
        // Encrypt password to register to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ email, password: hashedPassword });
        res.status(200).send(`Create user with email ${email}`);
      } catch (err) {
        console.log(err);
        res.status(400).send(`Failed creation user with email ${email}`);
      }
    }
  }
});

module.exports = router;
