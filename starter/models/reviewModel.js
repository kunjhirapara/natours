const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review is required'],
      trim: true,
      maxlength: [400, 'A review must have less or equal to 400 characters'],
      minlength: [10, 'A review must have more or equal to 10 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [1, 'Rating must be greater then 0'],
      max: [5, 'Rating must be less then 5'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a Tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  // this.populate({ path: 'tour', select: 'name' })
  //   .populate({
  //     path: 'user',
  //     select: 'name photo',
  //   })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log('🚀 ~ reviewModel.js:68 ~ stats:', stats);
  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function () {
  console.log('🚀 ~ this.getQuery():', this.getQuery());
  console.log('🚀 ~ reviewModel.js:88 ~ this.reviewQuery:', this.reviewQuery);
  this.reviewQuery = await this.model.findOne(this.getQuery());
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.reviewQuery.constructor.calcAverageRatings(this.reviewQuery.tour);
  if (this.reviewQuery)
    await mongoose.model('Review').calcAverageRatings(this.reviewQuery.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
