// Require
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes
router.post("/signup", (req, res) => {
  // check if mail exists already
  console.log(req.body);
  Users.findOne({ email: req.body.email })
    .then(usr => {
      if (usr !== null) {
        res.send("E-Mail already exists!");
      } else {
        // encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        // create user
        Users.create(req.body)
          .then(usr => {
            let user = usr.toObject();
            delete user.password;
            res.send({ token: jwt.sign(user, process.env.TOKEN_SECRET) });
          })
          .catch(err => res.send(err));
      }
    })
    .catch(err => console.log(err));
});
router.post("/login", (req, res) => {});

// Export
module.exports = router;
