const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const router = express.Router();

const Users = require('../models/users');

router.post('/addUser', function (req, res, next) {
  const user = {
    username: req.body.username,
    phoneNumber: req.body.phoneNumber
  };

  Users.create(user)
    .then(resp => {
      res.json(resp);
    })
    .catch(err => next(err));
});

module.exports = router;
