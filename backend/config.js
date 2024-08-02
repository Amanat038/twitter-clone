require ('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4100,
  MONGO_URL: process.env.MONGO_URL,
  // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: 'wfegtryjtuyktyjhtrtyuityrjetagfgerhetj'
};


// require('dotenv').config();

// module.exports = {
  // PORT: process.env.PORT || 4100,
  // MONGO_URL: process.env.MONGO_URL,
  // JWT_SECRET: 'wfegtryjtuyktyjhtrtyuityrjetagfgerhetj'
// };
