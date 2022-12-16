const mongoose = require("mongoose");

const commonDataSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "batch",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
});

const CommonData = mongoose.model("CommonData", commonDataSchema);
module.exports = CommonData;
