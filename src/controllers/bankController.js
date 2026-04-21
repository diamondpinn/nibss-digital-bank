const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { phoenixAPI, getAuthToken } = require('../services/phoenixService');

// 1. Check Balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ 
      accountName: user.firstName + ' ' + user.lastName,
      accountNumber: user.accountNumber, 
      balance: user.balance 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Name Enquiry (Requirement 3a)
exports.nameEnquiry = async (req, res) => {
  try {
    const nibssToken = await getAuthToken();
    const resEnquiry = await phoenixAPI.get('/api/account/name-enquiry/' + req.params.accountNumber, {
      headers: { Authorization: 'Bearer ' + nibssToken }
    });
    res.json(resEnquiry.data);
  } catch (err) {
    res.status(404).json({ message: 'Account not found on NIBSS' });
  }
};

// 3. Funds Transfer (Requirement 3b)
exports.transfer = async (req, res) => {
  try {
    const { toAccount, amount, description } = req.body;
    const sender = await User.findById(req.user.id);

    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient Funds' });

    const nibssToken = await getAuthToken();
    
    // Call NIBSS Phoenix Transfer API
    const transferRes = await phoenixAPI.post('/api/transfer', {
      from: sender.accountNumber,
      to: toAccount,
      amount: amount
    }, {
      headers: { Authorization: 'Bearer ' + nibssToken }
    });

    // Deduct from sender's local balance
    sender.balance -= amount;
    await sender.save();

    // Log Transaction for History (Requirement 4)
    const newTx = new Transaction({
      user: sender._id,
      type: 'DEBIT',
      amount,
      recipientAccount: toAccount,
      reference: transferRes.data.reference || 'TXN-' + Date.now(),
      description: description || 'Transfer to ' + toAccount
    });
    await newTx.save();

    res.json({ message: 'Transfer Successful', reference: newTx.reference, newBalance: sender.balance });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// 4. Get History (Requirement 4: Privacy)
exports.getHistory = async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const nibssToken = await getAuthToken();
    const result = await phoenixAPI.get('/api/transaction/' + req.params.ref, { headers: { Authorization: 'Bearer ' + nibssToken } });
    res.json(result.data);
  } catch (err) {
    res.status(404).json({ message: 'Transaction not found', detail: err.response ? err.response.data : err.message });
  }
};
