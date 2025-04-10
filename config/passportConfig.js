import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../Models/User.js';
import dotenv from 'dotenv';
dotenv.config();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        profile_image: profile.photos[0].value,
        password: '',
        role: 'user',
        confirmed: true,
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'emails', 'name', 'photos']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        profile_image: profile.photos[0].value,
        password: '',
        role: 'user',
        confirmed: true,
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});