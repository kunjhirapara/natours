class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );
    // console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // console.log(this.query);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fields() {
    // console.log(this);
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'fields', 'limit'];
// excludedFields.forEach((el) => delete queryObj[el]);

// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(
//   /\b(gte|gt|lte|lt|eq)\b/g,
//   (match) => `$${match}`,
// );
// console.log(JSON.parse(queryStr));
// let query = Tour.find(JSON.parse(queryStr));

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
//   console.log(query);
// } else {
//   query = query.sort('-createdAt');
// }

// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   console.log(fields);
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 5;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exists');
// }
