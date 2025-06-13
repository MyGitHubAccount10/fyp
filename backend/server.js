require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- ✅ Add this line

const categoryRoutes = require('./routes/CategoryRoute');
const customiseImgRoutes = require('./routes/CustomiseImgRoute');
const customiseRoutes = require('./routes/CustomiseRoute');
const orderProductRoutes = require('./routes/OrderProductRoute');
const orderRoutes = require('./routes/OrderRoute');
const productRoutes = require('./routes/ProductRoute');
const roleRoutes = require('./routes/RoleRoute');
const statusRoutes = require('./routes/StatusRoute');
const userRoutes = require('./routes/UserRoute');

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // frontend address
  credentials: true // if you're using cookies or auth headers
}));

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// 🧠 No need for this extra app.listen below — it was already called in the .then()
/*
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
*/

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    });
  })
  .catch((err) => {
    console.log(err)
  });

app.use('/api/category', categoryRoutes);
app.use('/api/customiseImg', customiseImgRoutes);
app.use('/api/customise', customiseRoutes);
app.use('/api/orderProduct', orderProductRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/status', statusRoutes);