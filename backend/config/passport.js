const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Setup local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // form field name
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        // 1) Find user by username
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // 2) Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // 3) If success
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
