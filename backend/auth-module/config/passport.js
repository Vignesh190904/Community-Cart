const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return done(new Error('Google OAuth not configured'), null);
    }
    
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    
    if (existingUser) {
      return done(null, existingUser);
    } else {
      return done(null, false, { message: 'User not registered in system. Contact administrator.' });
    }
  } catch (error) {
    return done(error, null);
  }
}));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Google OAuth configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - missing CLIENT_ID or CLIENT_SECRET');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
