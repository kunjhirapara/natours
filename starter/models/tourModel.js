const mongoose = require('mongoose');
const slugify = require('slugify');
// const Review = require('./reviewModel');
// const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour must have less or equal to 40 characters'],
      minlength: [10, 'A Tour must have more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be above 5'],
      set: (val) => val.toFixed(2),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price Discount ({VALUE}) must be less than the actual price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', async function () {
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre('save', async function () {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

// tourSchema.post('save', async function (doc) {
//   console.log(doc);
// });

// tourSchema.pre('find', async function () {
tourSchema.pre(/^find/, async function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

// tourSchema.post(/^find/, async function (docs) {
tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
});

tourSchema.post(/^find/, async function () {
  console.log(`Query took ${Date.now() - this.start} millisecs.`);
  // console.log(docs);
  this.find({ secretTour: { $ne: true } });
});

// tourSchema.pre('aggregate', async function () {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log('🚀 ~ tourModel.js:160 ~ this.pipeline():', this.pipeline());
//   // this.aggregate({ secretTour: { $ne: true } });
// });

// tourSchema.pre('findOneAndDelete', async function (next) {
//   const tour = await this.model.findOne(this.getFilter());
//   // console.log(`TOUR:   ${tour}`);
//   if (tour) {
//     await Review.deleteMany({ tour: tour._id });
//   }
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
