const JwtStrategy = require('passport-jwt').Strategy;

// model do usuario
const User = require('../app/models/user');
const config = require('../config/database'); // configuração do banco

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
