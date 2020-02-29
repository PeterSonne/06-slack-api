// Require
const Messages = require("../models/messages");
const Users = require("../models/users.js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../services/auth.js");

// Routes
router.post("/", (req, res) => {
  auth.verifyByHeaderToken(
    req.headers,
    () => {
      req.body.user = auth.tokenData._id;
      Messages.create(req.body)
        .then(message => {
          res.send(message);
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
      Messages.find(req.query)
        .populate("user")
        .then(messages => {
          res.send(messages);
        })
        .catch(err => res.send(err));
    },
    err => res.status(err.status).send(err.message)
  );
});

// Export
module.exports = router;
