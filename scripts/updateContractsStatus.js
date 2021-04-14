const Contract = require('../models/Contract');
const { PENDING, ACTIVE, FINISHED } = require('../const/contractStatus');

// Connect to DB
const connectDB = require('../db');

// Update contracts status based on thier start/finish time
const updateContractsStatus = async () => {
  try {
    console.log('Start updating contracts status');
    await connectDB();
    const contracts = await Contract.find({});
    for (const contract of contracts) {
      let { startAt, finishAt } = contract;
      let currentDate = Date.now();
      let status = PENDING;
      if (currentDate >= startAt && currentDate < finishAt) status = ACTIVE;
      if (currentDate >= finishAt) status = FINISHED;
      await contract.update({ status });
    }
    console.log('Finish updating contracts status');
  } catch (err) {
    console.log('Failed updating contracts status');
    console.log(err);
  }
};

// TIME_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
const TIME_INTERVAL = 60 * 1000; // 1 min

console.log(`Update contracts status on every ${TIME_INTERVAL / (60 * 1000)} min`);
setInterval(async () => {
  await updateContractsStatus();
}, TIME_INTERVAL);
