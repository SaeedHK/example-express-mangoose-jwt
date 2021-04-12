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

// Get contract by ID
router.get('/:contractId', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const contract = Contract.findById(contractId);
    if (!contract) {
      res.status(400).send(`There is no contract with id ${contractId}`);
    } else if (req.userIsAdmin) {
      res.status(200).send(contract);
    } else if (contract.clients.includes(req.userId)) {
      res.status(200).send(contract);
    } else {
      res.status(400).send('This user is not allowed to access this contract');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Get contract failed');
  }
});

// Create contract. Only admins are allowed
router.post('/', auth, async (req, res) => {
  try {
    if (req.userIsAdmin) {
      const { options, clients, startAt } = req.body;
      const contract = new Contract({ options, clients, startAt: formatDate(startAt) });
      await contract.save();
      res.status(200).send(`Create contract successfuly with id ${contract._id}.`);
    } else {
      res.status(400).send('Only admins are allowed create contracts');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Create contract failed');
  }
});

module.exports = router;
