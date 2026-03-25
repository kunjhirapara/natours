const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).select('role');
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  req.review = review;
  next();
});

exports.verifyReviewEditor = catchAsync(async (req, res, next) => {
  const { review } = req;
  // console.log('🚀 ~ reviewController.js:24 ~ review:', review);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  if (!review.user.equals(req.user.id)) {
    return next(new AppError('You are not authorized to do that', 403));
  }
  next();
});

exports.verifyReviewDeletion = catchAsync(async (req, res, next) => {
  const { review } = req;
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  if (req.user.role !== 'admin' && !review.user.equals(req.user.id)) {
    return next(new AppError('You are not Authorized to do that', 403));
  }
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
