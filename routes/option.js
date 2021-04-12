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

// Get Option by id
router.get('/:optionId', auth, async (req, res) => {
  try {
    const { optionId } = req.params;
    const option = await Option.findById(optionId);
    if (option) {
      res.status(200).send(option);
    } else {
      res.status(400).send(`There is no option with id ${optionId}`);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Getting option failed');
  }
});

module.exports = router;
