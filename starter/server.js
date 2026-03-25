const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('🚀 ~ server.js:6 ~ err:', err);

  console.log('🚀 ~ server.js:8 ~ name:', err.name, err.message);
  console.log('UNCAUGHT Exception! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('DB Connect Succesfully');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on the port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('🚀 ~ server.js: ~ name:', err.name, err.message);
  console.log('UNHANDALED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
