const { check } = require('express-validator');

exports.userSignInValidator = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

exports.userSignInProviderValidator = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  check('name').not().isEmpty().withMessage('Name is required')
];

exports.userSignUpValidator = [
  check('name').not().isEmpty().withMessage('Name is required.'),
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address.'),
  check('password')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];
