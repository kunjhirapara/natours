const path = require('path');
const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//  GLOBAL MIDDLEWARES
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//  Set security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         scriptSrc: ["'self'", 'https://unpkg.com'],
//         connectSrc: ["'self'", 'https://unpkg.com'],
//         imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
//       },
//     },
//   }),
// );

// DEVELOPMENT FIX FOR HELMET
app.use(helmet({ contentSecurityPolicy: false }));

app.set('query parser', (str) => qs.parse(str));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body.
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
// Remove $ characters from user input to prevent NoSQL injection
const removeNoSQLChars = (obj) => {
  if (typeof obj === 'string') {
    return obj.replace(/\$/g, '');
  }
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      obj[key] = removeNoSQLChars(obj[key]);
    });
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) removeNoSQLChars(req.body);
  if (req.query) removeNoSQLChars(req.query);
  if (req.params) removeNoSQLChars(req.params);
  next();
});

//Data sanitization against XSS
// Remove HTML and potentially malicious characters
const sanitizeXSS = (obj) => {
  if (typeof obj === 'string') {
    return obj
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      obj[key] = sanitizeXSS(obj[key]);
    });
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) sanitizeXSS(req.body);
  if (req.query) sanitizeXSS(req.query);
  if (req.params) sanitizeXSS(req.params);
  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static files

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('🚀 ~ req.cookies:', req.cookies);
  next();
});

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/', viewRouter);

app.all('/{*any}', (req, res, next) => {
  // const err = new Error(`Cant find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
