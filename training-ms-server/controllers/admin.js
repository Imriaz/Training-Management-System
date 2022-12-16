const Course = require("../models/course");
const User = require("../models/user");
const Batch = require("../models/batch");
const Topic = require("../models/topic");
const jwt = require("jsonwebtoken");
const { success, failure } = require("../utils/commonResponse");
const HTTP_STATUS = require("../utils/httpStatus");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const sendMail = require("../config/mail");
const crypto = require("crypto");
const ejs = require("ejs");
const fs = require("fs/promises");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");

class AdminController {
  //Create a new Batch
  async postBatch(req, res, next) {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const status = req.body.status;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;

      const batch = new Batch({
        title,
        description,
        status,
        startDate,
        endDate,
      });
      await batch.save();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Batch is created successfully", []));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Create a new Course
  async postCourse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!req.file) {
        errors.errors.push({
          param: "courseImage",
          msg: "Course Image is required. Only jpeg, jpg and png file is allowed!",
        });
      }
      if (!errors.isEmpty()) {
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      // console.log("image",req.file);
      const title = req.body.title;
      const batchId = req.body.batchId;
      const description = req.body.description;

      const imageUrl = "images/" + req.file.filename;
      const course = new Course({ title, batchId, description, imageUrl });
      await course.save();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Course is created successfully", []));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Update Course
  async postEditCourse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // delete the uploaded image if any validation error occurs
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const courseId = req.params.courseId;
      const updatedCourse = await Course.findById(courseId).exec();
      if (updatedCourse) {
        updatedCourse.title = req.body.title
          ? req.body.title
          : updatedCourse.title;
        updatedCourse.batchId = req.body.batchId
          ? req.body.batchId
          : updatedCourse.batchId;
        updatedCourse.description = req.body.description
          ? req.body.description
          : updatedCourse.description;
        // updatedCourse.imageUrl = req.file ? 'images/' + req.file.filename : updatedCourse.imageUrl;
        if (req.file) {
          await fs.unlink(path.join(__dirname, "..", updatedCourse.imageUrl));
          updatedCourse.imageUrl = "images/" + req.file.filename;
        }
        await updatedCourse.save();
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Course is updated successfully", updatedCourse));
      }
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Course is not found to update"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Create a new Topic
  async postTopic(req, res, next) {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const duration = req.body.duration;

      const batch = new Topic({
        title,
        description,
        duration,
      });
      await batch.save();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Topic is created successfully", []));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Create a new Trainer
  async addTrainer(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!req.file) {
        errors.errors.push({
          param: "trainerImage",
          msg: "Trainer Image is required. Only jpeg, jpg and png file is allowed!",
        });
      }
      if (!errors.isEmpty()) {
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const name = req.body.name;
      const email = req.body.email;
      const password = await bcrypt.hash("bjit1234", 10);
      const role = "Trainer";
      const topicId = req.body.topicId;
      const imageUrl = "images/" + req.file.filename;

      const user = new User({
        name,
        email,
        password,
        role,
        topicId,
        imageUrl,
      });
      await user.save();

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        topicId: topicId,
        imageUrl: imageUrl,
      };
      const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
        expiresIn: "10h",
      });
      const resData = {
        access_token: jwtToken,
        ...userData,
      };

      const token = crypto.randomBytes(32).toString("hex");
      user.verifyToken = token;
      user.verifyExpire = Date.now() + 60 * 60 * 10 * 1000;
      await user.save();

      const verifyUrl = path.join(
        process.env.BACKEND_URI,
        "verify-email",
        token,
        userData._id.toString()
      );

      const htmlStr = await ejsRenderFile(
        path.join(__dirname, "..", "mails", "verifyUser.ejs"),
        { name: userData.name, verifyUrl: verifyUrl }
      );

      sendMail({
        from: "TrainingMS <info@trainingms.com>",
        to: userData.email,
        subject: "Verify Email",
        html: htmlStr,
      });

      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainer is created successfully!", resData));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async postEditTrainer(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // delete the uploaded image if any validation error occurs
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const trainerId = req.params.trainerId;
      const updatedTrainer = await User.findById(trainerId).exec();
      if (updatedTrainer) {
        updatedTrainer.name = req.body.name
          ? req.body.name
          : updatedTrainer.name;
        updatedTrainer.email = req.body.email
          ? req.body.email
          : updatedTrainer.email;
        // updatedTrainer.topicId = req.body.topicId
        //   ? req.body.topicId
        //   : updatedTrainer.topicId;
        if (req.file) {
          await fs.unlink(path.join(__dirname, "..", updatedTrainer.imageUrl));
          updatedTrainer.imageUrl = "images/" + req.file.filename;
        }
        await updatedTrainer.save();
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Trainer is updated successfully", updatedTrainer));
      }
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Trainer is not found to update"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Add a new trainee
  async addTrainee(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!req.file) {
        errors.errors.push({
          param: "traineeImage",
          msg: "Trainee Image is required. Only jpeg, jpg and png file is allowed!",
        });
      }
      if (!errors.isEmpty()) {
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const name = req.body.name;
      const email = req.body.email;
      const password = await bcrypt.hash("bjit1234", 10);
      const role = "Trainee";
      const imageUrl = "images/" + req.file.filename;
      const user = new User({
        name,
        email,
        password,
        role,
        imageUrl,
      });
      await user.save();

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: imageUrl,
      };
      const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
        expiresIn: "10h",
      });
      const resData = {
        access_token: jwtToken,
        ...userData,
      };

      const token = crypto.randomBytes(32).toString("hex");
      user.verifyToken = token;
      user.verifyExpire = Date.now() + 60 * 60 * 10 * 1000;
      await user.save();

      const verifyUrl = path.join(
        process.env.BACKEND_URI,
        "verify-email",
        token,
        userData._id.toString()
      );

      const htmlStr = await ejsRenderFile(
        path.join(__dirname, "..", "mails", "verifyUser.ejs"),
        { name: userData.name, verifyUrl: verifyUrl }
      );

      sendMail({
        from: "TrainingMS <info@trainingms.com>",
        to: userData.email,
        subject: "Verify Email",
        html: htmlStr,
      });

      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainee is created successfully!", resData));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Edit a trainee
  async postEditTrainee(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // delete the uploaded image if any validation error occurs
        if (req.file) {
          await fs.unlink(
            path.join(__dirname, "..", "images", req.file.filename)
          );
        }
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const traineeId = req.params.traineeId;
      const updatedTrainee = await User.findById(traineeId).exec();
      if (updatedTrainee) {
        updatedTrainee.name = req.body.name
          ? req.body.name
          : updatedTrainee.name;
        updatedTrainee.email = req.body.email
          ? req.body.email
          : updatedTrainee.email;
        if (req.file) {
          await fs.unlink(path.join(__dirname, "..", updatedTrainee.imageUrl));
          updatedTrainee.imageUrl = "images/" + req.file.filename;
        }
        await updatedTrainee.save();
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Trainee is updated successfully", updatedTrainee));
      }
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Trainee is not found to update"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteTrainer(req, res, next) {
    try {
      const trainerId = req.params.trainerId;
      await User.findOneAndDelete({ _id: trainerId }).exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainer is deleted successfully"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteTrainee(req, res, next) {
    try {
      const traineeId = req.params.traineeId;
      await User.findOneAndDelete({ _id: traineeId }).exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainee is deleted successfully"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      const courseId = req.params.courseId;
      await Course.findOneAndDelete({ _id: courseId }).exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Course is deleted successfully"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // post trainee to batch
  async addToBatch(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const traineeId = req.body.traineeId;
      const batchId = req.params.batchId;
      const batch = await Batch.findOne({ _id: batchId }).exec();
      // check if any batch exists.
      if (batch) {
        //if exists, then add the trainee to that batch
        await batch.addToBatch(traineeId);
      } else {
        return res.status(HTTP_STATUS.OK).send(failure("Batch is not Found"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainee is added to batch"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Remove the trainee from the batch
  //   async postRemoveFromBatch(req, res, next) {
  //     try {
  //       const errors = validationResult(req);
  //       if (!errors.isEmpty()) {
  //         return res
  //           .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
  //           .send(failure("Invalid Inputs", errors.array()));
  //       }
  //       const traineeId = req.body.traineeId;
  //       const batchId = req.params.batchId;
  //       const batch = await Batch.findOne({ _id: batchId }).exec();
  //       if (batch) {
  //         await batch.removeFromBatch(traineeId);
  //       } else {
  //         return res
  //           .status(HTTP_STATUS.NOT_FOUND)
  //           .send(failure("Batch doesn't exist!!"));
  //       }
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(success("Trainee is removed from Batch"));
  //     } catch (error) {
  //       console.log(error);
  //       next(error);
  //     }
  //   }

  //Remove the trainee from the batch
  async deleteFromBatch(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const batchId = req.params.batchId;
      const traineeId = req.body.traineeId;
      const batch = await Batch.findOne({ _id: batchId }).exec();
      if (batch) {
        await batch.removeFromBatch(traineeId);
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Batch doesn't exist!!"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainee is removed from Batch"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // post Topic to Course
  async addToCourse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const topicId = req.body.topicId;
      const courseId = req.params.courseId;
      const course = await Course.findOne({ _id: courseId }).exec();
      // check if any course exists.
      if (course) {
        //if exists, then add the Topic to that course
        await course.addToCourse(topicId);
      } else {
        return res.status(HTTP_STATUS.OK).send(failure("Course is not Found"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Topic is added to Course"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // post Topic to Course
  // async addToCourse(req, res, next) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
  //         .send(failure("Invalid Inputs", errors.array()));
  //     }
  //     const topicId = req.body.topicId;
  //     const courseId = req.params.courseId;
  //     const course = await Course.findOne({ _id: courseId }).exec();
  //     // check if any course exists.
  //     if (course) {
  //       const topic = await Topic.findById(topicId).exec();
  //       if (topic.courseId) {
  //         if (topic.courseId == courseId) {
  //           return res
  //             .status(HTTP_STATUS.ALREADY_REPORTED)
  //             .send(failure("Topic is already include in this Course"));
  //         } else {
  //           return res
  //             .status(HTTP_STATUS.ALREADY_REPORTED)
  //             .send(failure("Topic is already include in another Course"));
  //         }
  //       } else {
  //         topic.courseId = courseId;
  //         await topic.save();
  //         //if exists, then add the topic to that course
  //         await course.addToCourse(topicId);
  //       }
  //     } else {
  //       return res
  //         .status(HTTP_STATUS.NOT_FOUND)
  //         .send(failure("Course is not Found"));
  //     }
  //     return res
  //       .status(HTTP_STATUS.OK)
  //       .send(success("Topic is added to course"));
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  //Remove the Topic from the Course
  async deleteFromCourse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const courseId = req.params.courseId;
      const topicId = req.body.topicId;
      const course = await Course.findOne({ _id: courseId }).exec();
      if (course) {
        await course.removeFromCourse(topicId);
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Course doesn't exist!!"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Topic is removed from Course"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  //Remove the Topic from the Course
  // async deleteFromCourse(req, res, next) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
  //         .send(failure("Invalid Inputs", errors.array()));
  //     }
  //     const courseId = req.params.courseId;
  //     const topicId = req.body.topicId;
  //     const course = await Course.findOne({ _id: courseId }).exec();
  //     if (course) {
  //       const filter = { _id: topicId };
  //       const update = { $unset: { courseId: "" } };

  //       let updateCourse = await Topic.findOneAndUpdate(filter, update, {
  //         new: true,
  //       });
  //       await course.removeFromCourse(topicId);
  //     } else {
  //       return res
  //         .status(HTTP_STATUS.NOT_FOUND)
  //         .send(failure("Course doesn't exist!!"));
  //     }
  //     return res
  //       .status(HTTP_STATUS.OK)
  //       .send(success("Topic is removed from Course"));
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }
}

module.exports = new AdminController();
