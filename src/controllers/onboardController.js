const fetch = require('node-fetch');

exports.onboardNibss = async (req, res) => {
    try {
        const response = await fetch('https://api.phoenix.nibss-plc.com.ng/sandbox/v1/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PHOENIX_API_KEY}`,
                'x-api-secret': process.env.PHOENIX_API_SECRET
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ message: "NIBSS Connection Error" });
    }
};
