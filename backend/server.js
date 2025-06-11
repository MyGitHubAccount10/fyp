require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')

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

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 

app.use('/api/category', categoryRoutes);
app.use('/api/customiseImg', customiseImgRoutes);
app.use('/api/customise', customiseRoutes);
app.use('/api/orderProduct', orderProductRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/status', statusRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});