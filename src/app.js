const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// --- ADDED: Serve the frontend files ---
app.use(express.static('public'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bank', require('./routes/bankRoutes'));

// --- ADDED: Fallback to index.html ---
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'));
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
