const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Make the frontend images folder accessible via /images so our products load properly
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Basic route (if needed, but usually frontend takes over root)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Moddlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
