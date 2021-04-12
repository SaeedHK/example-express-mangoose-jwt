const mongoose = require('mongoose');
const { PENDING, ACTIVE, FINISHED } = require('../const/contractStatus');

const ContractSchema = new mongoose.Schema({
  // unique Ids are generated automotically by mongoose
  startAt: {
    type: Date,
    require: true,
  },
  options: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
    required: true,
  },
  clients: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  status: {
    type: String,
    enum: [PENDING, ACTIVE, FINISHED],
    default: () => PENDING,
  },
  finishAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contract', ContractSchema);
