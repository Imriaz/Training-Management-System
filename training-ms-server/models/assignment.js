const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Batch",
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  submission: [
    {
      trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      answer: {
        type: String,
      },
      // marks: {
      //   type: String,
      // },
    },
  ],

  assignmentMarks: [
    {
      trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      marks: {
        type: String,
      },
    },
  ],
});

assignmentSchema.methods.submitToAssignment = async function (traineeId, answer) {
  try {
    this.submission.push({
      trainee: traineeId,
      answer: answer,
    });
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

assignmentSchema.methods.submitAssignmentMarks = async function (
  traineeId,
  marks
) {
  try {
    this.assignmentMarks.push({
      trainee: traineeId,
      marks: marks,
    });
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// assignmentSchema.methods.submitAssignmentMarks = async function (traineeId, answer, marks) {
//   try {
//     // this.submission.filter(obj=>)
//     this.submission.push({
//       marks:marks,
//     });
//     await this.save();
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
