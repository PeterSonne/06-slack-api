const jwt = require("jsonwebtoken");
const Users = require("../models/users");

module.exports = {
  tokenData: {},
  successCallback: () => {},
  failCallback: () => {},
  verifyByHeaderToken: function(header, success, fail) {
    this.successCallback = success;
    this.failCallback = fail;
    let token = "";
    if (header.authorization == null) {
      this.failCallback({ message: "Invalid Token", status: 406 });
      return;
    }
    try {
      token = header.authorization.split(" ")[1];
    } catch (err) {
      this.failCallback(err);
      return;
    }
    try {
      this.tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      this.failCallback({ message: "Invalid Token", status: 406 });
      return;
    }
    // check if necessary data are in token
    if (
      this.tokenData == null ||
      !this.tokenData.hasOwnProperty("_id") ||
      !this.tokenData.hasOwnProperty("password")
    ) {
      this.tokenData = {};
      this.failCallback({ message: "Invalid Token Data", status: 406 });
      return;
    }
    // check user versus DB
    this.checkUser();
  },
  checkUser: function() {
    Users.findById(this.tokenData._id)
      .select("password")
      .then(usr => {
        if (usr.password != null && usr.password == this.tokenData.password) {
          this.successCallback();
        } else {
          this.failCallback({ message: "User not valid compar", status: 401 });
        }
      })
      .catch(err => {
        this.failCallback({ message: "User not valid catch", status: 401 });
        return;
      });
  }
};
