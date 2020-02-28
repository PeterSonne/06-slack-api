// Require
const Channels = require("../models/channels");
const Users = require("../models/users.js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

// Routes
router.post("/", (req, res) => {
  if (req.headers.authorization == null || req.headers.authorization == "") {
    res.send("Not authorized");
    return;
  }
  let token = req.headers.authorization.split(" ")[1];
  let tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
  if (tokenData == null) {
    res.send("Not authorized");
    return;
  }
  console.log(tokenData.password);

  Users.findById(tokenData._id)
    .select("password")
    .then(doc => {
      console.log(doc);
      if (doc == null || doc == "") {
        res.send("Not authorized");
        return;
      }
      if (tokenData.password == doc.password) {
        Channels.create(req.body)
          .then(channel => {
            res.send(channel);
          })
          .catch(err => res.send(err));
      } else {
        res.send("Not authorized");
      }
    });
});
router.get("/", (req, res) => {
  if (req.headers.authorization == null || req.headers.authorization == "") {
    res.send("Not authorized");
    return;
  }
  let token = req.headers.authorization.split(" ")[1];
  let tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
  if (tokenData == null) {
    res.send("Not authorized");
    return;
  }
  console.log(tokenData.password);

  Users.findById(tokenData._id)
    .select("password")
    .then(doc => {
      console.log(doc);
      if (doc == null || doc == "") {
        res.send("Not authorized");
        return;
      }
      if (tokenData.password == doc.password) {
        Channels.find(req.query)
          .then(channels => {
            res.send(channels);
          })
          .catch(err => res.send(err));
      } else {
        res.send("Not authorized");
      }
    });
});

// Export
module.exports = router;
