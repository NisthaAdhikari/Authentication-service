const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      // Find the user by the ID in the payload
      const user = await User.findById(payload.userId);

      // If the user doesn't exist
      if (!user) {
        return done(null, false);
      }

      // If the user is found, pass the user object to the next middleware
      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  })
);

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = {
  authenticate,
};

