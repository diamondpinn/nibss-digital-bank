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
        
        if (!response.ok) {
            console.error('NIBSS API Error:', data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('System Bridge Error:', error.message);
        res.status(500).json({ 
            message: "NIBSS Connection Error", 
            error: error.message 
        });
    }
};
