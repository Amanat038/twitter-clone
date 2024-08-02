const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { PORT, MONGO_URL } = require('./config');

const app = express();

global._basedir = __dirname;

console.log('MONGO_URL:', MONGO_URL); 

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB is connected');
  } catch (err) {
    console.error('MongoDB connection unsuccessful:', err.message);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

mongoose.connection.on('error', (error) => {
  console.log('Error connected to db', error);
});




// Middlewares
app.use(cors({
  // origin: CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());



// Models
require('./models/user_model');
require('./models/post_model');


// Routes
app.use(require('./routes/user_route'));
app.use(require('./routes/post_route'));
app.use(require('./routes/file_route'));





// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: 'Something went wrong! Please try again later.',
  });
});



// listen

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
