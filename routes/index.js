var express = require('express');
var router = express.Router();
var passport = require('passport');




router.get('/protected', function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      // internal server error occurred
      return next(err);
    }
    if (!user) {
      // no JWT or user found
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (user) {
// authentication was successful! send user the secret code.
      return res
        .status(200)
        .json({ secret: 'hackerman' });
    }
  })(req, res, next);
});

module.exports = router;
