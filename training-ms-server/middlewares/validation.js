const { body } = require('express-validator');
const User = require('../models/user');

const validator = {
  createCourse: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be string!"),
    body("batchId")
      .notEmpty()
      .withMessage("Batch Id is required")
      .isString()
      .withMessage("Batch Id must be string!"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be string!"),
  ],
  updateTrainer: [
    body("name", "Name is required and must be string")
      .trim()
      .notEmpty()
      .isString(),
    body("email").trim().isEmail().withMessage("E-mail is invalid"),
  ],
  updateTrainee: [
    body("name", "Name is required and must be string")
      .trim()
      .notEmpty()
      .isString(),
    body("email").trim().isEmail().withMessage("E-mail is invalid"),
  ],
  updateCourse: [
    body("title").isString().withMessage("Title must be string!"),
    body("description").isString().withMessage("Description must me string"),
  ],
  createBatch: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be string!"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be string!"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isString()
      .withMessage("Status must be string!"),
  ],

  createTopic: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be string!"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be string!"),
    body("duration")
      .notEmpty()
      .withMessage("Duration is required")
      .isString()
      .withMessage("Duration must be string!"),
  ],

  createUser: [
    body("name", "Name is required and must be string")
      .trim()
      .notEmpty()
      .isString(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("E-mail is invalid")
      .custom(async (value) => {
        const user = await User.findOne({ email: value }).exec();
        if (user) {
          return Promise.reject("E-mail is already exists!");
        }
        return true;
      }),
    // body("password")
    //   .trim()
    //   .isLength({ min: 6 })
    //   .withMessage("Password must be at least 6 character"),
    // body("confirmPassword")
    //   .trim()
    //   .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error("Password doesn't match!");
    //     }
    //     return true;
    //   }),
  ],

  signup: [
    body("name", "Name is required and must be string")
      .trim()
      .notEmpty()
      .isString(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("E-mail is invalid")
      .custom(async (value) => {
        const user = await User.findOne({ email: value }).exec();
        if (user) {
          return Promise.reject("E-mail is already exists!");
        }
        return true;
      }),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character"),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password doesn't match!");
        }
        return true;
      }),
  ],

  signin: [
    body("email").trim().isEmail().withMessage("E-mail is invalid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],

  resetPasswordMail: body("email")
    .trim()
    .isEmail()
    .withMessage("Please give a valid email"),

  resetPassword: [
    body("token")
      .trim()
      .isString()
      .withMessage("Token is required and must be string"),
    body("userId")
      .trim()
      .isString()
      .withMessage("userId is required and must be string"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character"),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password doesn't match!");
        }
        return true;
      }),
  ],
};

module.exports = validator;
