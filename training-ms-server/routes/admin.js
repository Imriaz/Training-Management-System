const express = require("express");
const adminController = require("../controllers/admin");
const validator = require("../middlewares/validation");
const multer = require("multer");
const path = require("path");
const { checkAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0].replace(/\ /g, "") +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const checkImage = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: checkImage,
});

//Add a Trainer
router.post(
  "/add-trainer",
  checkAuth,
  isAdmin,
  upload.single("trainerImage"),
  validator.createUser,
  adminController.addTrainer
);

//Add a Trainee
router.post(
  "/add-trainee",
  checkAuth,
  isAdmin,
  upload.single("traineeImage"),
  validator.createUser,
  adminController.addTrainee
);

//Add a Course
router.post(
  "/add-course",
  checkAuth,
  isAdmin,
  upload.single("courseImage"),
  validator.createCourse,
  adminController.postCourse
);

//Update a Trainer
router.put(
  "/edit-trainer/:trainerId",
  checkAuth,
  isAdmin,
  upload.single("trainerImage"),
  // validator.updateTrainer,
  adminController.postEditTrainer
);

//Update a Trainee
router.put(
  "/edit-trainee/:traineeId",
  checkAuth,
  isAdmin,
  upload.single("traineeImage"),
  // validator.updateTrainee,
  adminController.postEditTrainee
);

//Update a Course
router.put(
  "/edit-course/:courseId",
  checkAuth,
  isAdmin,
  upload.single("courseImage"),
  validator.updateCourse,
  adminController.postEditCourse
);

//Add a Batch
router.post(
  "/add-batch",
  checkAuth,
  isAdmin,
  validator.createBatch,
  adminController.postBatch
);

//Add a Topic
router.post(
  "/add-topic",
  checkAuth,
  isAdmin,
  //   validator.createTopic,
  adminController.postTopic
);

//Delete a Trainer
router.delete(
  "/delete-trainer/:trainerId",
  checkAuth,
  isAdmin,
  adminController.deleteTrainer
);

//Delete a Trainee
router.delete(
  "/delete-trainee/:traineeId",
  checkAuth,
  isAdmin,
  adminController.deleteTrainee
);

//Delete a Course
router.delete(
  "/delete-course/:courseId",
  checkAuth,
  isAdmin,
  adminController.deleteCourse
);

// Add trainee to Batch
router.post(
  "/addToBatch/:batchId",
  checkAuth,
  isAdmin,
  adminController.addToBatch
);

// delete trainee from Batch
router.delete(
  "/remove-trainee-from-batch/:batchId",
  checkAuth,
  isAdmin,
  adminController.deleteFromBatch
);

// Add topic to Course
router.post(
  "/AddToCourse/:courseId",
  checkAuth,
  isAdmin,
  adminController.addToCourse
);

// delete Topic from Course
router.delete(
  "/remove-topic-from-course/:courseId",
  checkAuth,
  isAdmin,
  adminController.deleteFromCourse
);

module.exports = router;
