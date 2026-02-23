const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkId = (req, res, next, val) => {
  // console.log(`the id is: ${val}`);
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour)
    return res.status(404).send({ status: 'fail', message: 'Invalid Id' });
  next();
};

exports.checkBody = (req, res, next) => {
  console.log('runs');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name or Price Not available!! try again',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours: tours },
  });
};

exports.addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).send({ status: 'success', data: { tour } });
};

exports.updateTour = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      tour: '<h1>updated tour here<h1/>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send({
    status: 'success',
    data: null,
  });
};
