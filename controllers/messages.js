// Require
const Messages = require("../models/messages");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../services/auth.js");

// Routes
router.post("/", (req, res) => {
  // get Token
  if (req.headers.authorization == null) {
    res.send("Authorization failed!");
  }
  let token = req.headers.authorization.split(" ")[1];
  let tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
  console.log(tokenData);
  req.body.user = tokenData._id;
  console.log(req.body);
  Messages.create(req.body)
    .then(message => {
      res.send(message);
    })
    .catch(err => res.send(err));
});
router.get("/", (req, res) => {
  Messages.find(req.query)
    .populate("user")
    .then(messages => {
      res.send(messages);
    })
    .catch(err => res.send(err));
});

// Export
module.exports = router;
