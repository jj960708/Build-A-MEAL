const jwt = require("jsonwebtoken");
const jwtSecret = "mysecret";

module.exports = function(req, res, next) {
  const token =
  req.body.token ||
  req.query.token ||
  req.headers['x-access-token'] ||
  req.cookies.token;
  console.log(req.cookies);
  if (!token) {
    console.log("token not found... what u doing!!\n");
    return res.status(401).json({ msg: "No token" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log("token not valid... what u doing!!\n");
    res.status(401).json({ msg: "Token is not valid" });
  }
};
