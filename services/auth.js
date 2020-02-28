const jwt = require("jsonwebtoken");

module.exports = {
  tokenData: {},
  verifyByHeaderToken: function(header) {
    if (header.authorization == null) {
      return false;
    }
    let token = header.authorization.split(" ")[1];
    this.tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
    return this.tokenData != null;
  }
};
