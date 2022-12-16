const User = require("../models/user");
const Batch = require("../models/batch");
const Course = require("../models/course");
const Topic = require("../models/topic");
const { success, failure } = require("../utils/commonResponse");
const getPagination = require("../utils/pagination");
const HTTP_STATUS = require("../utils/httpStatus");
const { validationResult } = require("express-validator");
const Assignment = require("../models/assignment");

class ViewController {
  //   Get all Trainer
  async getTrainer(req, res, next) {
    try {
      const trainer = await User.find({ role: "Trainer" }).exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Trainer are fetched successfully", trainer));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   Get all  Trainer with Pagination

  // async getTrainer(req, res, next) {
  //   try {
  //     const page = req.query.page ? req.query.page : 1;
  //     const itemPerPage = req.query.itemPerPage ? req.query.itemPerPage : 3;
  //     const { skip, limit } = getPagination(page, itemPerPage);

  //     const trainer = await User.find({ role: "Trainer" })
  //       .skip(skip)
  //       .limit(limit)
  //       .exec();
  //     const total = await User.count().exec();
  //     return res
  //       .status(HTTP_STATUS.OK)
  //       .send(
  //         success("All Trainer are fetched successfully", { trainer, total })
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  //get all Trainee
  async getTrainee(req, res, next) {
    try {
      const trainee = await User.find({ role: "Trainee" }).exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Trainee are fetched successfully", trainee));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   async getTrainee(req, res, next) {
  //     try {
  //       const page = req.query.page ? req.query.page : 1;
  //       const itemPerPage = req.query.itemPerPage ? req.query.itemPerPage : 3;
  //       const { skip, limit } = getPagination(page, itemPerPage);

  //       const trainee = await User.find({ role: "Trainee" })
  //         .skip(skip)
  //         .limit(limit)
  //         .exec();
  //       const total = await User.count().exec();
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(
  //           success("All Trainee are fetched successfully", { trainee, total })
  //         );
  //     } catch (error) {
  //       console.log(error);
  //       next(error);
  //     }
  //   }

  //Get all batches
  async getBatch(req, res, next) {
    try {
      const batches = await Batch.find().exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Batches are fetched successfully", batches));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //get all courses
  async getCourse(req, res, next) {
    try {
      const courses = await Course.find().exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Courses are fetched successfully", courses));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //get all topics
  async getTopic(req, res, next) {
    try {
      const topics = await Topic.find().exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Topics are fetched successfully", topics));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   async getHome(req, res, next) {
  //     try {
  //       const page = req.query.page ? req.query.page : 1;
  //       const itemPerPage = req.query.itemPerPage ? req.query.itemPerPage : 5;
  //       const { skip, limit } = getPagination(page, itemPerPage);

  //       const products = await Product.find().skip(skip).limit(limit).exec();
  //       const total = await Product.count().exec();
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(
  //           success("All products are fetched successfully", { products, total })
  //         );
  //     } catch (error) {
  //       console.log(error);
  //       next(error);
  //     }
  //   }

  //Get Single Course
  // async getSingleCourse(req, res, next) {
  //   try {
  //     const courseId = req.params.courseId;
  //     const course = await Course.findById(courseId).exec();
  //     if (course) {
  //       return res.status(HTTP_STATUS.OK).send(success("Course Found", course));
  //     }
  //     return res.status(HTTP_STATUS.OK).send(success("Course not Found"));
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  //Get Single Course
  async getSingleCourse(req, res, next) {
    try {
      const courseId = req.params.courseId;
      const course = await Course.findById(courseId)
        .populate("_id", "title -_id")
        .populate("topics.topic", "title _id")
        .populate("batchId", "title _id")
        .exec();
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Topics are fetched from Course", course));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // get a Single batch
  async getSingleBatch(req, res, next) {
    try {
      const batchId = req.params.batchId;
      // const batch = await Batch.findById(batchId).exec();
      const trainees = await Batch.findOne({ _id: batchId })
        .populate("_id", "name -_id")
        .populate("trainees.trainee", "name _id")
        .exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Trainees are fetched from Batch", trainees));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Get Single Trainer
  async getSingleTrainer(req, res, next) {
    try {
      const trainerId = req.params.trainerId;
      const trainer = await User.findById(trainerId)
      // .populate("_id", "title -_id")
        .populate("topicId", "title _id")
        .exec();
      if (trainer) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Trainer Found", trainer));
      }
      return res.status(HTTP_STATUS.OK).send(success("Trainer not Found"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Get Single Trainee
  async getSingleTrainee(req, res, next) {
    try {
      const traineeId = req.params.traineeId;
      const trainee = await User.findById(traineeId).exec();
      if (trainee) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Trainee Found", trainee));
      }
      return res.status(HTTP_STATUS.OK).send(success("Trainee not Found"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //Create a new Assignment
  async postAssignment(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!req.file) {
        errors.errors.push({
          param: "assignmentImage",
          msg: "Assignment Image is required. Only jpeg, jpg and png file is allowed!",
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
      const trainerId = req.body.trainerId;
      const batchId = req.body.batchId;

      const imageUrl = "images/" + req.file.filename;
      const assignment = new Assignment({
        title,
        batchId,
        trainerId,
        imageUrl,
      });
      await assignment.save();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Assignment is created successfully", []));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //get Assignment
  async getAssignment(req, res, next) {
    try {
      const assignments = await Assignment.find().exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All Assignments are fetched successfully", assignments));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Submit Assignment
  async submitAssignment(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const traineeId = req.body.traineeId;
      const answer = req.body.answer;
      const assignmentId = req.params.assignmentId;
      const assignment = await Assignment.findOne({ _id: assignmentId }).exec();
      // check if any assignment exists.
      if (assignment) {
        //if exists, then add the submission to that assignment
        await assignment.submitToAssignment(traineeId, answer);
      } else {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Assignment is not Found"));
      }
      return res.status(HTTP_STATUS.OK).send(success("Submission is done!"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Submit Marks
  async submitMarks(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Invalid Inputs", errors.array()));
      }
      const traineeId = req.body.traineeId;
      const marks = req.body.marks;
      const assignmentId = req.params.assignmentId;
      const assignment = await Assignment.findOne({ _id: assignmentId }).exec();
      // check if any assignment exists.
      if (assignment) {
        //if exists, then add the submission to that assignment
        await assignment.submitAssignmentMarks(traineeId, marks);
      } else {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Assignment is not Found"));
      }
      return res.status(HTTP_STATUS.OK).send(success("Marking is done!"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // get a Single Assignment
  async getSingleAssignment(req, res, next) {
    try {
      const assignmentId = req.params.assignmentId;
      // const batch = await Batch.findById(batchId).exec();
      const assignmentMarks = await Assignment.findOne({ _id: assignmentId })
        .populate("_id", "name -_id")
        .populate("assignmentMarks.trainee", "name _id")
        .exec();
      return res
        .status(HTTP_STATUS.OK)
        .send(
          success(
            "Assignment Marks are fetched from Assignment",
            assignmentMarks
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // get trainee Assignment marks
  // async getTraineeAssignmentMarks(req, res, next) {
  //   try {
  //     const traineeId = req.params.traineeId;
  //     // const batch = await Batch.findById(batchId).exec();
  //     const assignmentMarks = await Assignment.find()
  //       .populate("_id", "name -_id")
  //       .populate("assignmentMarks.trainee", "name _id")
  //       .exec();
  //     return res
  //       .status(HTTP_STATUS.OK)
  //       .send(
  //         success(
  //           "Assignment Marks are fetched from Assignment",
  //           assignmentMarks
  //         )
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }
}

module.exports = new ViewController();
