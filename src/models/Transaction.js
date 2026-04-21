const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  amount: { type: Number, required: true },
  recipientAccount: { type: String, required: true },
  recipientBank: { type: String, default: 'DIA Bank' },
  reference: { type: String, unique: true }, // NIBSS transaction reference
  status: { type: String, default: 'SUCCESS' },
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
