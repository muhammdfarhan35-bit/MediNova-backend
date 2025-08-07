const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({ origin: 'http://muhammadfarhan35-bit.github.io' }));
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Connection successful from backend to frontend!' });
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

