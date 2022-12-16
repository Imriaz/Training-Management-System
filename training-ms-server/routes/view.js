const express = require("express");
const viewController = require("../controllers/view");
const router = express.Router();
const validator = require("../middlewares/validation");
const { checkAuth, isAdmin, isTrainer, isTrainee } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

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

router.get("/courses", viewController.getCourse);

router.get("/batches", 
checkAuth, 
viewController.getBatch);

router.get("/trainer", 
// checkAuth, 
// isAdmin, 
viewController.getTrainer);

// router.get("/trainee", checkAuth, isAdmin, viewController.getTrainee);
router.get("/trainee", viewController.getTrainee);

router.get("/courses/:courseId", checkAuth, viewController.getSingleCourse);

router.get("/topics", viewController.getTopic);

// router.get("/batches/:batchId", checkAuth, viewController.getSingleBatch);

router.get(
  "/trainer/:trainerId",
  // checkAuth,
  // isAdmin,
  viewController.getSingleTrainer
);
router.get(
  "/trainee/:traineeId",
//   checkAuth,
//   isAdmin,
  viewController.getSingleTrainee
);

router.get("/batches/:batchId", 
checkAuth,
isAdmin,
viewController.getSingleBatch);

router.post(
  "/create-assignment",
  checkAuth,
  isTrainer,
  upload.single("assignmentImage"),
  viewController.postAssignment
);

router.get("/assignments", 
// checkAuth, 
viewController.getAssignment);

router.get(
  "/assignments/:assignmentId",
  // checkAuth,
  viewController.getSingleAssignment
);

// get trainee Assignment marks
// router.get(
//   "/get-assignment-marks/:traineeId",
//   // checkAuth,
//   viewController.getTraineeAssignmentMarks
// );


// Submit the assignment
router.post(
  "/submit-assignment/:assignmentId",
  checkAuth,
  isTrainee,
  viewController.submitAssignment
);

// Submit the assignment marks
router.post(
  "/submit-assignment-marks/:assignmentId",
  checkAuth,
  isTrainer,
  viewController.submitMarks
);

// router.get('/', shopController.getHome);

// router.get('/cart', checkAuth, shopController.getCart);

// router.post('/cart', checkAuth, validator.cart, shopController.postCart);

// router.delete('/remove-product-cart', checkAuth, validator.cart, shopController.postCartDeleteProduct);

module.exports = router;
