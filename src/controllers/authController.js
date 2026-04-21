const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { phoenixAPI, getAuthToken } = require('../services/phoenixService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, accountNumber: user.accountNumber, firstName: user.firstName }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { firstName: user.firstName, lastName: user.lastName, accountNumber: user.accountNumber, balance: user.balance } });
  } catch (err) { res.status(500).json({ message: 'Login failed', error: err.message }); }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, kycType, kycID, dob } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const existingKYC = await User.findOne({ kycID });
    if (existingKYC) return res.status(400).json({ message: 'This BVN already has an account in DIA Bank' });
    let nibssToken;
    try { nibssToken = await getAuthToken(); }
    catch (e) { return res.status(500).json({ message: 'Could not connect to NIBSS' }); }
    const validateEndpoint = kycType.toUpperCase() === 'BVN' ? '/api/validateBvn' : '/api/validateNin';
    const kycPayload = kycType.toUpperCase() === 'BVN' ? { bvn: kycID } : { nin: kycID };
    let kycRes;
    try { kycRes = await phoenixAPI.post(validateEndpoint, kycPayload); console.log('KYC:', JSON.stringify(kycRes.data)); }
    catch (e) { return res.status(400).json({ message: 'BVN not found in NIBSS', detail: e.response ? e.response.data : e.message }); }
    const isValid = kycRes.data.valid === true || kycRes.data.success === true;
    if (!isValid) return res.status(400).json({ message: 'KYC not valid', nibssResponse: kycRes.data });
    let accountRes;
    try {
      accountRes = await phoenixAPI.post('/api/account/create', { kycType: kycType.toLowerCase(), kycID, dob }, { headers: { Authorization: 'Bearer ' + nibssToken } });
      console.log('NIBSS account response:', JSON.stringify(accountRes.data));
    } catch (accErr) {
      const accData = accErr.response ? accErr.response.data : {};
      console.log('NIBSS account error:', JSON.stringify(accData));
      return res.status(500).json({ message: 'NIBSS account creation failed', nibssError: accData });
    }
    const nibssData = accountRes.data;
    console.log('nibssData keys:', Object.keys(nibssData));
    const accountNumber = nibssData.accountNumber || nibssData.account || (nibssData.data && nibssData.data.accountNumber);
    console.log('Extracted accountNumber:', accountNumber);
    if (!accountNumber) return res.status(500).json({ message: 'No account number in NIBSS response', nibssData: nibssData });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, kycType: kycType.toUpperCase(), kycID, accountNumber, balance: 15000 });
    await newUser.save();
    res.status(201).json({ message: 'Welcome to DIA Bank!', accountNumber, bankCode: process.env.BANK_CODE, bankName: process.env.BANK_NAME, balance: 15000 });
  } catch (err) {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ message: 'Unexpected server error', error: err.message });
  }
};
