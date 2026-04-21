const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const auth = require('../middleware/auth');
const { phoenixAPI, getAuthToken } = require('../services/phoenixService');

router.get('/balance', auth, bankController.getBalance);
router.get('/history', auth, bankController.getHistory);
router.get('/name-enquiry/:accountNumber', auth, bankController.nameEnquiry);
router.post('/transfer', auth, bankController.transfer);
router.get('/transaction/:ref', auth, bankController.checkTransactionStatus);

router.get('/debug/nibss-accounts', async (req, res) => {
  try {
    const token = await getAuthToken();
    const result = await phoenixAPI.get('/api/accounts', {
      headers: { Authorization: 'Bearer ' + token }
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.response ? err.response.data : err.message });
  }
});

module.exports = router;
