const router = require('express').Router();
const auth = require('../middleware/auth');
const Option = require('../models/Option');

// Get all options
router.get('/', auth, async (req, res) => {
  try {
    const option = await Option.find({});
    if (option) {
      res.status(200).send(option);
    } else {
      res.status(400).send(`There is no option in database`);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Getting option failed');
  }
});

module.exports = router;
