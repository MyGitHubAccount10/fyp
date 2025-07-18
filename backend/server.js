require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- ✅ Add this line

const categoryRoutes = require('./routes/CategoryRoute');
const customiseRoutes = require('./routes/CustomiseRoute');
const customiseImgRoutes = require('./routes/CustomiseImgRoute');
const orderProductRoutes = require('./routes/OrderProductRoute');
const orderRoutes = require('./routes/OrderRoute');
const productRoutes = require('./routes/ProductRoute');
const roleRoutes = require('./routes/RoleRoute');
const statusRoutes = require('./routes/StatusRoute');
const userRoutes = require('./routes/UserRoute');
const promoRoutes = require('./routes/PromoRoute');

const app = express();

// Enable CORS with specific options
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

// 🧠 No need for this extra app.listen below — it was already called in the .then()
/*
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
*/

try {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('connected to database')
      app.listen(process.env.PORT, () => {
        console.log('listening for requests on port', process.env.PORT)
      });
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err.message)
    });
} catch (error) {
  console.log('Server startup error:', error.message);
}

app.use('/api/category', categoryRoutes);
app.use('/api/customise', customiseRoutes);
app.use('/api/customise-img', customiseImgRoutes);
app.use('/api/order-products', orderProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/promo', promoRoutes);