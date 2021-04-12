const router = require('express').Router();
const jwt = require('jsonwebtoken');
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

// Add admin user
router.post('/addadmin', auth, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Both email and password are obligatory');
  } else if (!req.userIsAdmin) {
    res.status(400).send('Only admin users can add new admin');
  } else {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      res.status(400).send(`User with email ${email} already exists`);
    } else {
      try {
        // Encrypt password to register to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ email, password: hashedPassword, isAdmin: true });
        res.status(200).send(`Create admin with email ${email}`);
      } catch (err) {
        console.log(err);
        res.status(400).send(`Failed creation admin with email ${email}`);
      }
    }
  }
});

// Generate token
router.get('/gentoken', async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    res.status(400).send('Both email and password are obligatory');
  } else {
    const user = await User.findOne({ email });
    if (user) {
      // Validate password hash
      const validPass = await bcrypt.compare(password, user.password);
      if (validPass) {
        const token = jwt.sign({ _id: user._id }, 'jwt_secret', { expiresIn: '1h' });
        res.status(200).send({ token });
      } else {
        res.status(400).send('Password is wrong');
      }
    } else {
      res.status(400).send(`No user found with email ${email}`);
    }
  }
});

module.exports = router;
