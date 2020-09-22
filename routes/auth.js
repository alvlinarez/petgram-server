const express = require('express');
const router = express.Router();
const User = require('../models/User');
const config = require('../config/env');
const jwt = require('jsonwebtoken');

// Validators
const { runValidation } = require('../utils/validators');
const {
  userSignInValidator,
  userSignInProviderValidator,
  userSignUpValidator
} = require('../utils/validators/auth');

// isAuth
const isAuth = require('../utils/isAuth');

// Get auth user
router.post('/', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(200).json({});
  }
  const { sub: id, name, email } = jwt.verify(token, config.jwtSecret);
  if (!id || !name || !email) {
    return res.status(401).json({
      error: 'Invalid token.'
    });
  }
  res.status(200).json({
    user: {
      id,
      name,
      email
    }
  });
});

// Sign in route
router.post('/signin', userSignInValidator, runValidation, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      error: 'Email and password are required.'
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'User does not exists.'
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Incorrect password.'
      });
    }
    user = user.toJSON();
    const { id, name } = user;
    const payload = {
      sub: id,
      name,
      email
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d'
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env !== 'development'
    });
    return res.status(200).json({
      user: {
        id,
        name,
        email
      }
    });
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error.'
    });
  }
});

// Sign in with Facebook and Google
router.post(
  '/signin-provider',
  userSignInProviderValidator,
  runValidation,
  async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }
    try {
      let user = await User.findOne({ email });
      if (user) {
        user = await user.toJSON();
        const payload = {
          sub: user.id,
          name: user.name,
          email
        };
        const token = jwt.sign(payload, config.jwtSecret, {
          expiresIn: '7d'
        });
        res.cookie('token', token, {
          httpOnly: true,
          secure: config.env !== 'development'
        });
        return res.status(200).json({
          token,
          user: {
            id: user.id,
            name,
            email
          }
        });
      } else {
        user = new User({
          name,
          email,
          password: email + config.jwtSecret
        });
        try {
          user = await user.save();
          user = user.toJSON();
          const payload = {
            sub: user.id,
            name: user.name,
            email: user.email
          };
          const token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: '7d'
          });
          res.cookie('token', token, {
            httpOnly: true,
            secure: config.env !== 'development'
          });
          return res.status(200).json({
            token,
            user: {
              id: user.id,
              name,
              email
            }
          });
        } catch (e) {
          return res.status(400).json({ error: e.message });
        }
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
);

// Sign up route
router.post('/signup', userSignUpValidator, runValidation, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: 'Email already exists.'
      });
    }
    user = new User({ name, email, password, favorites: [] });
    try {
      await user.save();
      return res.status(200).json({
        message: 'Sign up success. Please sign in.'
      });
    } catch (e) {
      return res.status(401).json({
        error: 'Error creating user. Try signing up again.'
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error.'
    });
  }
});

// Sign Out
// Auth to verify if user signed In
router.post('/signout', isAuth, (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    message: 'Signed out successfully'
  });
});

module.exports = router;
