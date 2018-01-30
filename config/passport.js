const JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
const User = require('../app/models/user');
const config = require('../config/database'); // get db config file

module.exports = function(passport) {
  let opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};
