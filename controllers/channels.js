// Require
const Channels = require("../models/channels");
const Users = require("../models/users.js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../services/auth");

// Routes
router.post("/", (req, res) => {
  auth.verifyByHeaderToken(
    req.headers,
    () => {
      Channels.create(req.body)
        .then(channel => {
          res.send(channel);
        })
        .catch(err => res.send(err));
    },
    err => res.status(err.status).send(err.message)
  );
});
router.get("/", (req, res) => {
  auth.verifyByHeaderToken(
    req.headers,
    () => {
      Channels.find(req.query)
        .then(channels => {
          res.send(channels);
        })
        .catch(err => res.send(err));
    },
    err => res.status(err.status).send(err.message)
  );
});

// Export
module.exports = router;
