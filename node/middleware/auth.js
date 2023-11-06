const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // get token from header
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({errors: [{msg: "No token, authorization denied"}]});
  }
  try {
    const decode = jwt.verify(token, config.get('jwtSecret'));
    if (decode.user.active == false) {
      return res.status(401).json({errors: [{msg: "Token is not valid"}]});
    }
    req.user = decode.user;
    next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({errors: [{msg: "Token is not valid"}]});
  }
}