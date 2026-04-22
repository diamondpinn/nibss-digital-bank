const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { phoenixAPI, getAuthToken } = require('../services/phoenixService');

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ accountName: user.firstName + ' ' + user.lastName, accountNumber: user.accountNumber, balance: user.balance });
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

exports.nameEnquiry = async (req, res) => {
  try {
    const nibssToken = await getAuthToken();
    const result = await phoenixAPI.get('/api/account/name-enquiry/' + req.params.accountNumber, { headers: { Authorization: 'Bearer ' + nibssToken } });
    res.json(result.data);
  } catch (err) { res.status(404).json({ message: 'Account not found', detail: err.response ? err.response.data : err.message }); }
};

exports.transfer = async (req, res) => {
  try {
    const { toAccount, amount, description } = req.body;
    if (!toAccount || !amount) return res.status(400).json({ message: 'toAccount and amount are required' });
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
    const sender = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient funds in DIA Bank', balance: sender.balance });
    const nibssToken = await getAuthToken();
    const payload = { from: String(sender.accountNumber), to: String(toAccount), amount: String(amount) };
    console.log('NIBSS transfer payload:', JSON.stringify(payload));
    let transferRes;
    try {
      transferRes = await phoenixAPI.post('/api/transfer', payload, { headers: { Authorization: 'Bearer ' + nibssToken } });
      console.log('NIBSS transfer success:', JSON.stringify(transferRes.data));
    } catch (nibssErr) {
      const nibssErrData = nibssErr.response ? nibssErr.response.data : nibssErr.message;
      console.error('NIBSS transfer FAILED:', JSON.stringify(nibssErrData));
      return res.status(500).json({ message: 'NIBSS transfer failed', nibssError: nibssErrData });
    }
    const ref = (transferRes.data.reference) || (transferRes.data.data && transferRes.data.data.reference) || (transferRes.data.transactionId) || ('TXN-' + Date.now());
    sender.balance -= amount;
    await sender.save();
    await new Transaction({ user: sender._id, type: 'DEBIT', amount, recipientAccount: toAccount, reference: ref, description: description || 'Transfer to ' + toAccount, status: 'SUCCESS' }).save();
    const recipient = await User.findOne({ accountNumber: toAccount });
    if (recipient) {
      recipient.balance += amount;
      await recipient.save();
      await new Transaction({ user: recipient._id, type: 'CREDIT', amount, recipientAccount: sender.accountNumber, reference: ref + '-CR', description: 'Transfer from ' + sender.accountNumber, status: 'SUCCESS' }).save();
    }
    res.json({ message: 'Transfer successful', reference: ref, amountSent: amount, newBalance: sender.balance });
  } catch (err) {
    console.error('Transfer error:', err.message);
    res.status(500).json({ message: 'Transfer error', error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) { res.status(500).json({ message: 'Could not fetch history' }); }
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const nibssToken = await getAuthToken();
    const result = await phoenixAPI.get('/api/transaction/' + req.params.ref, { headers: { Authorization: 'Bearer ' + nibssToken } });
    res.json(result.data);
  } catch (err) { res.status(404).json({ message: 'Transaction not found', detail: err.response ? err.response.data : err.message }); }
};
