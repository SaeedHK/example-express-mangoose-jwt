const Option = require('../models/Option');
const optionsList = require('../const/options');

const connectDB = require('../db');
const feedOptions = async () => {
  optionsList.forEach(async (optionSpec) => {
    let optionDoc = await Option.findOne({ title: optionSpec.title });
    // Check if such option already exists
    if (optionDoc) {
      await optionDoc.update(optionSpec);
      console.log(`Option updated: ${optionDoc}`);
    } else {
      optionDoc = new Option(optionSpec);
      await optionDoc.save();
      console.log(`Option created: ${optionDoc}`);
    }
  });
};

const main = async () => {
  try {
    await connectDB();
    await feedOptions();
  } catch (err) {
    console.log('Feeding options failed');
    console.log(err);
  }
};

main();

setTimeout(() => {
  process.exit(0);
}, 5 * 1000);
