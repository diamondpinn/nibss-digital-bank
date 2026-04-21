const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
connectDB();

app.use(express.json());
app.use(morgan('dev'));

// Route Registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bank', require('./routes/bankRoutes')); // The new routes we just made

app.get('/', (req, res) => res.send('DIA Bank Core API Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
