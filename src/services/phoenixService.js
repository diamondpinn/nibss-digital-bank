const axios = require('axios');
const https = require('https');

const phoenixAPI = axios.create({
  baseURL: 'https://nibssbyphoenix.onrender.com',
  timeout: 15000,
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

const getAuthToken = async () => {
  try {
    const res = await phoenixAPI.post('/api/auth/token', {
      apiKey: process.env.PHOENIX_API_KEY,
      apiSecret: process.env.PHOENIX_API_SECRET
    });
    return res.data.token;
  } catch (err) {
    console.error('NIBSS Auth Error:', err.message);
    return null;
  }
};

const validateKYC = async (type, id) => {
  try {
    const token = await getAuthToken();
    if (!token) return false;
    const endpoint = type === 'BVN' ? '/api/validateBvn' : '/api/validateNin';
    const payload = type === 'BVN' ? { bvn: id } : { nin: id };
    const res = await phoenixAPI.post(endpoint, payload, {
      headers: { Authorization: 'Bearer ' + token }
    });
    return res.status === 200 || res.data.valid === true;
  } catch (err) {
    return false;
  }
};

module.exports = { phoenixAPI, getAuthToken, validateKYC };
