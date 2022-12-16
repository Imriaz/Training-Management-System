const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  
  trainees: [
    {
      trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});
batchSchema.methods.addToBatch = async function (traineeId) {
  try {
    this.trainees.push({
      trainee: traineeId,
    });
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

batchSchema.methods.removeFromBatch = async function (traineeId) {
  try {
    this.trainees = this.trainees.filter(
      (traineeR) => traineeR.trainee.toString() !== traineeId.toString()
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
