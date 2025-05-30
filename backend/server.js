require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const app = express();

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

app.get('/', (req, res) => {
    res.json({message: 'Welcome to backend!'});
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});