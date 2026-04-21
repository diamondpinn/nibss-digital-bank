const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    fromAccount: { type: String, required: true },
    toAccount: { type: String, required: true },

    bankCode: { type: String }, // for interbank
    bankName: { type: String },

    amount: { type: Number, required: true },

    type: { type: String, enum: ['INTRA', 'INTER'], required: true },

    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'SUCCESS' },

    narration: { type: String, default: 'Transfer' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
