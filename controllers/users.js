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
        res.send({ message: "E-Mail adress already in use!" });
      } else {
        // encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        // create user
        Users.create(req.body)
          .then(usr => {
            res.send({
              token: jwt.sign(usr.toObject(), process.env.TOKEN_SECRET)
            });
          })
          .catch(err => res.send(err));
      }
    })
    .catch(err => console.log(err));
});
router.post("/login", (req, res) => {
  Users.findOne({ email: req.body.email })
    .select("+password")
    .then(doc => {
      console.log("Found: ", doc);
      if (doc === null) {
        res.send({ message: "E-Mail found in DB" });
      } else {
        console.log({ message: "E-Mail found in DB" });
        if (bcrypt.compareSync(req.body.password, doc.password)) {
          res.send({
            token: jwt.sign(doc.toObject(), process.env.TOKEN_SECRET)
          });
        } else {
          res.send({ message: "Invalid password" });
        }
      }
    });
});

// Export
module.exports = router;
