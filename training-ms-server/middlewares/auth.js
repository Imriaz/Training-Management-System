const jwt = require('jsonwebtoken');
const { failure } = require('../utils/commonResponse');
const HTTP_STATUS = require('../utils/httpStatus');

const checkAuth = (req, res, next) => {
    if (req.get('authorization')) {
        try {
            const token = req.get('authorization').split(' ')[1];
            const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = {
              _id: decodedData._id,
              name: decodedData.name,
              email: decodedData.email,
              role: decodedData.role,
              isVerify: decodedData.isVerify,
            };
            next();
        } catch (error) {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failure(error.message));
        }
        
    } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('Unauthorized request'));
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role == 'Admin') {
        next();
    } else {
        return res.status(HTTP_STATUS.FORBIDDEN).send(failure('You are forbidden for that request'));
    }
}

const isTrainer = (req, res, next) => {
  if (req.user.role == "Trainer") {
    next();
  } else {
    return res
      .status(HTTP_STATUS.FORBIDDEN)
      .send(failure("You are forbidden for that request"));
  }
};

const isTrainee = (req, res, next) => {
  if (req.user.role == "Trainee") {
    next();
  } else {
    return res
      .status(HTTP_STATUS.FORBIDDEN)
      .send(failure("You are forbidden for that request"));
  }
};

module.exports = {
  checkAuth,
  isAdmin,
  isTrainer,
  isTrainee
};