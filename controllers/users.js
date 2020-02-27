// Require
const Users = require("../models/users");
const router = require("express").Router();

// Routes
router.post("/signup", (req, res) => {
  // check if mail exists already
  console.log(req.body);
  Users.findOne({ email: req.body.email })
    .then(usr => {
      if (usr !== null) {
        res.send("E-Mail already exists!");
      } else {
        // create user
        Users.create(req.body)
          .then(usr => res.send(usr))
          .catch(err => res.send(err));
      }
    })
    .catch(err => console.log(err));
});
router.post("/login", (req, res) => {});

// Export
module.exports = router;
