const router = require('express').Router();
const auth = require('../middleware/auth');
const Contract = require('../models/Contract');

// Get all contract
router.get('/', auth, async (req, res) => {
  try {
    if (req.userIsAdmin) {
      const contracts = await Contract.find({});
      res.status(200).send(contracts);
    } else {
      const contracts = await Contract.find({ clients: req.userId });
      res.status(200).send(contracts);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Get contract failed');
  }
});

module.exports = router;
