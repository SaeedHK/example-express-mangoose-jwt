const mongoose = require('mongoose');

const OptionsSchema = new mongoose.Schema({
  // unique Ids are generated automotically by mongoose
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Option', OptionsSchema);
