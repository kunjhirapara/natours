const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users-simple.json`),
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users: users },
  });
};

exports.addNewUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  users.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/users-simple.json`,
    JSON.stringify(users),
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

exports.getUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user)
    return res.status(404).send({ status: 'fail', message: 'Invalid Id' });

  res.status(200).send({ status: 'success', data: { user } });
};

exports.updateUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user)
    return res.status(404).send({ status: 'fail', message: 'Invalid Id' });

  res.status(200).send({
    status: 'success',
    data: {
      user: '<h1>updated user here<h1/>',
    },
  });
};

exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user)
    return res.status(404).send({ status: 'fail', message: 'Invalid Id' });

  res.status(204).send({
    status: 'success',
    data: null,
  });
};
